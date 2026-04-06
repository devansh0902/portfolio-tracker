from flask import Blueprint, request
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.utils.responses import success_response, error_response
from app.utils.validators import validate_email, validate_password

auth_bp = Blueprint("auth", __name__)

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    # Input validation
    if not name:
        return error_response("Name is required", 400)
    if not validate_email(email):
        return error_response("A valid email is required", 400)
    if not validate_password(password):
        return error_response("Password must be at least 6 characters long", 400)

    # Duplicate check
    if User.query.filter_by(email=email).first():
        return error_response("Email already registered", 409)

    try:
        user = User(name=name, email=email)
        user.set_password(password) # Hash the password

        db.session.add(user)
        db.session.commit()

        return success_response({"id": user.id, "email": user.email}, "User registered successfully", 201)
    except Exception as e:
        db.session.rollback()
        return error_response("Server error during registration", 500)


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not validate_email(email):
        return error_response("Invalid email format", 400)

    user = User.query.filter_by(email=email).first()

    # Check password via hash
    if user and user.check_password(password):
        # Generate JWT Token based on user ID
        access_token = create_access_token(identity=str(user.id))
        return success_response({"access_token": access_token}, "Login successful")

    return error_response("Invalid email or password", 401)

# PROTECTED ROUTE EXAMPLE
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    # Retrieve user identity from the token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return error_response("User not found", 404)

    return success_response({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })