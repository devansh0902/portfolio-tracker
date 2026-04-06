from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    """Returns a standard success JSON response."""
    response = {
        "status": "success",
        "message": message,
    }
    if data is not None:
        response["data"] = data
        
    return jsonify(response), status_code

def error_response(message="An error occurred", status_code=400, errors=None):
    """Returns a standard error JSON response."""
    response = {
        "status": "error",
        "message": message,
    }
    if errors is not None:
        response["errors"] = errors
        
    return jsonify(response), status_code
