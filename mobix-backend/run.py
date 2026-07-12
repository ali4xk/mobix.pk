from app import create_app, db
from app.models import User, Listing, ListingImage, Message, Review, Report

app = create_app()

with app.app_context():
    db.create_all()

@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "Listing": Listing,
        "ListingImage": ListingImage,
        "Message": Message,
        "Review": Review,
        "Report": Report
    }

if __name__ == "__main__":
    app.run(debug=True)