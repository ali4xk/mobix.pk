from app import db
from datetime import datetime

class Listing(db.Model):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default="active")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    images = db.relationship("ListingImage", backref="listing", lazy=True, cascade="all, delete-orphan")
    messages = db.relationship("Message", backref="listing", lazy=True)
    reports = db.relationship("Report", backref="listing", lazy=True)

    def __repr__(self):
        return f"<Listing {self.title}>"


class ListingImage(db.Model):
    __tablename__ = "listing_images"

    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey("listings.id"), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)