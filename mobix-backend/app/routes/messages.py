from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.message import Message
from app.models.user import User
from app.models.listing import Listing

messages_bp = Blueprint("messages", __name__)

@messages_bp.route("", methods=["POST"])
@jwt_required()
def send_message():
    user_id = get_jwt_identity()
    data = request.get_json()

    receiver_id = data.get("receiver_id")
    listing_id = data.get("listing_id")
    content = data.get("content")

    if not receiver_id or not listing_id or not content:
        return jsonify({"error": "receiver_id, listing_id and content are required"}), 400

    if str(receiver_id) == str(user_id):
        return jsonify({"error": "You cannot message yourself"}), 400

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({"error": "Receiver not found"}), 404

    message = Message(
        sender_id=user_id,
        receiver_id=receiver_id,
        listing_id=listing_id,
        content=content
    )

    db.session.add(message)
    db.session.commit()

    return jsonify({"message": "Message sent successfully", "message_id": message.id}), 201


@messages_bp.route("/conversations", methods=["GET"])
@jwt_required()
def get_conversations():
    user_id = get_jwt_identity()

    messages = Message.query.filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).order_by(Message.created_at.desc()).all()

    seen = set()
    conversations = []

    for msg in messages:
        other_user_id = msg.receiver_id if str(msg.sender_id) == str(user_id) else msg.sender_id
        key = f"{msg.listing_id}-{other_user_id}"

        if key not in seen:
            seen.add(key)
            other_user = User.query.get(other_user_id)
            listing = Listing.query.get(msg.listing_id)

            conversations.append({
                "listing_id": msg.listing_id,
                "listing_title": listing.title if listing else None,
                "other_user_id": other_user_id,
                "other_user_name": other_user.name if other_user else None,
                "last_message": msg.content,
                "is_read": msg.is_read,
                "created_at": msg.created_at.isoformat()
            })

    return jsonify({"conversations": conversations}), 200


@messages_bp.route("/<int:listing_id>/<int:other_user_id>", methods=["GET"])
@jwt_required()
def get_thread(listing_id, other_user_id):
    user_id = get_jwt_identity()

    messages = Message.query.filter(
        Message.listing_id == listing_id,
        (
            (Message.sender_id == user_id) & (Message.receiver_id == other_user_id) |
            (Message.sender_id == other_user_id) & (Message.receiver_id == user_id)
        )
    ).order_by(Message.created_at.asc()).all()

    for msg in messages:
        if str(msg.receiver_id) == str(user_id) and not msg.is_read:
            msg.is_read = True

    db.session.commit()

    thread = []
    for msg in messages:
        thread.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "receiver_id": msg.receiver_id,
            "content": msg.content,
            "is_read": msg.is_read,
            "created_at": msg.created_at.isoformat()
        })

    return jsonify({"messages": thread}), 200