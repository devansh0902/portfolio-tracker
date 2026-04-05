from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.asset import Asset
from flask_jwt_extended import jwt_required, get_jwt_identity

portfolio_bp = Blueprint("portfolio", __name__)

# CREATE an Asset
@portfolio_bp.route("/", methods=["POST"])
@jwt_required()
def add_asset():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"message": "Asset name is required"}), 400

    new_asset = Asset(
        name=data.get("name"),
        quantity=data.get("quantity", 0.0),
        price=data.get("price", 0.0),
        user_id=current_user_id
    )

    db.session.add(new_asset)
    db.session.commit()

    return jsonify({"message": "Asset added successfully", "asset": new_asset.to_dict()}), 201

# READ all Assets for the User
@portfolio_bp.route("/", methods=["GET"])
@jwt_required()
def get_assets():
    current_user_id = get_jwt_identity()
    # Ensure a user only fetches their own assets
    assets = Asset.query.filter_by(user_id=current_user_id).all()
    
    return jsonify([asset.to_dict() for asset in assets])

# UPDATE an Asset
@portfolio_bp.route("/<int:asset_id>", methods=["PUT"])
@jwt_required()
def update_asset(asset_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()

    asset = Asset.query.filter_by(id=asset_id, user_id=current_user_id).first()

    if not asset:
        return jsonify({"message": "Asset not found or unauthorized"}), 404

    # Allow partial updates
    if "name" in data:
        asset.name = data["name"]
    if "quantity" in data:
        asset.quantity = data["quantity"]
    if "price" in data:
        asset.price = data["price"]

    db.session.commit()

    return jsonify({"message": "Asset updated successfully", "asset": asset.to_dict()})

# DELETE an Asset
@portfolio_bp.route("/<int:asset_id>", methods=["DELETE"])
@jwt_required()
def delete_asset(asset_id):
    current_user_id = get_jwt_identity()

    asset = Asset.query.filter_by(id=asset_id, user_id=current_user_id).first()

    if not asset:
        return jsonify({"message": "Asset not found or unauthorized"}), 404

    db.session.delete(asset)
    db.session.commit()

    return jsonify({"message": "Asset deleted successfully"})
