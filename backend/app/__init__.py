from flask import Flask
from .extensions import db

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SECRET_KEY"] = "secret"

    db.init_app(app)

    @app.route("/")
    def home():
        return {"message": "Server running successfully!"}

    return app