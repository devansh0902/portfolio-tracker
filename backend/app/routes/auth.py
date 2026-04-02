from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    user = User(
        name=data.get("name"),
        email=data.get("email"),
        password=data.get("password")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:
        return jsonify({"message": "Login successful"})

    return jsonify({"message": "Invalid email or password"}), 401