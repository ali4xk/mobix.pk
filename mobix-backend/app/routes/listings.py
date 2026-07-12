from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.listing import Listing, ListingImage
from app.utils import upload_image

listings_bp = Blueprint("listings", __name__)

VALID_CATEGORIES = ["mobile", "tablet", "laptop", "accessory", "gaming"]
VALID_CONDITIONS = ["Like New", "Excellent", "Good", "Fair", "For Parts"]

@listings_bp.route("", methods=["POST"])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()

    title = request.form.get("title")
    brand = request.form.get("brand")
    model = request.form.get("model")
    price = request.form.get("price")
    condition = request.form.get("condition")
    category = request.form.get("category")
    city = request.form.get("city")
    description = request.form.get("description")

    if not all([title, brand, model, price, condition, category, city]):
        return jsonify({"error": "All fields are required"}), 400

    if category not in VALID_CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400

    if condition not in VALID_CONDITIONS:
        return jsonify({"error": "Invalid condition"}), 400

    images = request.files.getlist("images")
    if len(images) < 2:
        return jsonify({"error": "At least 2 images are required"}), 400

    listing = Listing(
        user_id=user_id,
        title=title,
        brand=brand,
        model=model,
        price=int(price),
        condition=condition,
        category=category,
        city=city,
        description=description
    )

    db.session.add(listing)
    db.session.flush()

    for i, image in enumerate(images):
        url = upload_image(image)
        listing_image = ListingImage(
            listing_id=listing.id,
            image_url=url,
            is_primary=(i == 0)
        )
        db.session.add(listing_image)

    db.session.commit()

    return jsonify({"message": "Listing created successfully", "listing_id": listing.id}), 201


@listings_bp.route("", methods=["GET"])
def get_listings():
    category = request.args.get("category")
    city = request.args.get("city")
    condition = request.args.get("condition")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    search = request.args.get("search")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Listing.query.filter_by(status="active")

    if category:
        query = query.filter_by(category=category)
    if city:
        query = query.filter_by(city=city)
    if condition:
        query = query.filter_by(condition=condition)
    if min_price:
        query = query.filter(Listing.price >= int(min_price))
    if max_price:
        query = query.filter(Listing.price <= int(max_price))
    if search:
        query = query.filter(
            Listing.title.ilike(f"%{search}%") |
            Listing.brand.ilike(f"%{search}%") |
            Listing.model.ilike(f"%{search}%")
        )

    query = query.order_by(Listing.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    listings = []
    for listing in pagination.items:
        primary_image = ListingImage.query.filter_by(listing_id=listing.id, is_primary=True).first()
        listings.append({
            "id": listing.id,
            "title": listing.title,
            "brand": listing.brand,
            "model": listing.model,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "city": listing.city,
            "image": primary_image.image_url if primary_image else None,
            "created_at": listing.created_at.isoformat()
        })

    return jsonify({
        "listings": listings,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200


@listings_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_listings():
    user_id = get_jwt_identity()
    listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()

    result = []
    for listing in listings:
        primary_image = ListingImage.query.filter_by(listing_id=listing.id, is_primary=True).first()
        result.append({
            "id": listing.id,
            "title": listing.title,
            "brand": listing.brand,
            "model": listing.model,
            "price": listing.price,
            "condition": listing.condition,
            "category": listing.category,
            "city": listing.city,
            "status": listing.status,
            "image": primary_image.image_url if primary_image else None,
            "created_at": listing.created_at.isoformat()
        })

    return jsonify({"listings": result}), 200


@listings_bp.route("/<int:listing_id>", methods=["GET"])
def get_listing(listing_id):
    listing = Listing.query.get_or_404(listing_id)

    images = ListingImage.query.filter_by(listing_id=listing.id).all()

    return jsonify({
        "id": listing.id,
        "title": listing.title,
        "brand": listing.brand,
        "model": listing.model,
        "price": listing.price,
        "condition": listing.condition,
        "category": listing.category,
        "city": listing.city,
        "description": listing.description,
        "status": listing.status,
        "seller_id": listing.user_id,
        "images": [img.image_url for img in images],
        "created_at": listing.created_at.isoformat()
    }), 200


@listings_bp.route("/<int:listing_id>", methods=["PUT"])
@jwt_required()
def update_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)

    if str(listing.user_id) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    listing.title = data.get("title", listing.title)
    listing.brand = data.get("brand", listing.brand)
    listing.model = data.get("model", listing.model)
    listing.price = data.get("price", listing.price)
    listing.condition = data.get("condition", listing.condition)
    listing.city = data.get("city", listing.city)
    listing.description = data.get("description", listing.description)
    listing.status = data.get("status", listing.status)

    db.session.commit()

    return jsonify({"message": "Listing updated successfully"}), 200


@listings_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)

    if str(listing.user_id) != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(listing)
    db.session.commit()

    return jsonify({"message": "Listing deleted successfully"}), 200