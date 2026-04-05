from flask import Flask
from .extensions import db

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SECRET_KEY"] = "secret"
    app.config["JWT_SECRET_KEY"] = "your-very-secret-jwt-key" # Keep this safe!

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

    return app