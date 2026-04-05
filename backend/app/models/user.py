from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(256)) # Increased length for hash

    # Relationship to link assets
    assets = db.relationship('Asset', backref='owner', lazy=True, cascade="all, delete-orphan")

    def set_password(self, clear_password):
        self.password = generate_password_hash(clear_password)

    def check_password(self, clear_password):
        return check_password_hash(self.password, clear_password)

    def __repr__(self):
        return f"<User {self.email}>"