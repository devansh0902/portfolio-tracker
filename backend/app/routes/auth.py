from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
auth_bp= Blueprint('auth', __name__)
@auth_bp.route("/register",methods=["POST"])
def register():
    data=request.get_json()
    user=User(
    name=data["name"],
    email=data["email"], 
    password=data["password"]
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201