from flask import Blueprint, request
from app.extensions import db
from app.models.asset import Asset
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.responses import success_response, error_response

portfolio_bp = Blueprint("portfolio", __name__)

# CREATE an Asset
@portfolio_bp.route("/", methods=["POST"])
@jwt_required()
def add_asset():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("name"):
        return error_response("Asset name is required", 400)

    try:
        quantity = float(data.get("quantity", 0.0))
        price = float(data.get("price", 0.0))
    except ValueError:
        return error_response("Quantity and price must be numbers", 400)

    try:
        new_asset = Asset(
            name=data.get("name"),
            quantity=quantity,
            price=price,
            user_id=current_user_id
        )

        db.session.add(new_asset)
        db.session.commit()

        return success_response({"asset": new_asset.to_dict()}, "Asset added successfully", 201)
    except Exception as e:
        db.session.rollback()
        return error_response("An error occurred while adding asset", 500)

# READ all Assets for the User
@portfolio_bp.route("/", methods=["GET"])
@jwt_required()
def get_assets():
    current_user_id = get_jwt_identity()
    # Ensure a user only fetches their own assets
    assets = Asset.query.filter_by(user_id=current_user_id).all()
    
    return success_response([asset.to_dict() for asset in assets])

# UPDATE an Asset
@portfolio_bp.route("/<int:asset_id>", methods=["PUT"])
@jwt_required()
def update_asset(asset_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()

    asset = Asset.query.filter_by(id=asset_id, user_id=current_user_id).first()

    if not asset:
        return error_response("Asset not found or unauthorized", 404)

    try:
        # Allow partial updates
        if "name" in data:
            asset.name = data["name"]
        if "quantity" in data:
            asset.quantity = float(data["quantity"])
        if "price" in data:
            asset.price = float(data["price"])

        db.session.commit()

        return success_response({"asset": asset.to_dict()}, "Asset updated successfully")
    except ValueError:
        return error_response("Quantity and price must be numbers", 400)
    except Exception as e:
        db.session.rollback()
        return error_response("An error occurred while updating asset", 500)

# DELETE an Asset
@portfolio_bp.route("/<int:asset_id>", methods=["DELETE"])
@jwt_required()
def delete_asset(asset_id):
    current_user_id = get_jwt_identity()

    asset = Asset.query.filter_by(id=asset_id, user_id=current_user_id).first()

    if not asset:
        return error_response("Asset not found or unauthorized", 404)

    try:
        db.session.delete(asset)
        db.session.commit()

        return success_response(None, "Asset deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("An error occurred while deleting asset", 500)
