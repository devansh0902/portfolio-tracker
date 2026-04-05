from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    user = User(
        name=data.get("name"),
        email=data.get("email")
    )
    user.set_password(data.get("password")) # Hash the password

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

    # Check password via hash
    if user and user.check_password(password):
        # Generate JWT Token based on user ID
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "Login successful",
            "access_token": access_token
        })

    return jsonify({"message": "Invalid email or password"}), 401

# PROTECTED ROUTE EXAMPLE
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # Retrieve user identity from the token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })