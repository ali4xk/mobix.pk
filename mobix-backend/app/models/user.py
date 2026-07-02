from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    city = db.Column(db.String(100), nullable=True)
    cnic_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    listings = db.relationship("Listing", backref="seller", lazy=True)
    sent_messages = db.relationship("Message", foreign_keys="Message.sender_id", backref="sender", lazy=True)
    received_messages = db.relationship("Message", foreign_keys="Message.receiver_id", backref="receiver", lazy=True)
    reviews_given = db.relationship("Review", foreign_keys="Review.reviewer_id", backref="reviewer", lazy=True)
    reviews_received = db.relationship("Review", foreign_keys="Review.reviewed_id", backref="reviewed", lazy=True)

    def __repr__(self):
        return f"<User {self.email}>"