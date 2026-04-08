from flask import Flask
from flask_cors import CORS
from .extensions import db
from .utils.responses import error_response

def create_app():
    app = Flask(__name__)

    app.config.from_object('config.Config')

    CORS(app)

    db.init_app(app)
    
    from .extensions import jwt
    jwt.init_app(app)
    
    from .routes.auth import auth_bp  
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from .routes.portfolio import portfolio_bp
    app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")

    @app.route("/")
    def home():
        return {"message": "Server running successfully!"}

    @app.errorhandler(400)
    def bad_request(error):
        return error_response("Bad Request", 400)

    @app.errorhandler(404)
    def not_found(error):
        return error_response("Not Found", 404)

    @app.errorhandler(405)
    def method_not_allowed(error):
        return error_response("Method Not Allowed", 405)

    @app.errorhandler(500)
    def internal_error(error):
        return error_response("Internal Server Error", 500)

    return app