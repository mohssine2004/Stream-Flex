from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    from app.routes.video_routes import video_bp
    from app.routes.auth_routes import auth_bp

    app.register_blueprint(video_bp, url_prefix="/api/videos")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/", methods=["GET"])
    def home():
        return {
            "message": "Welcome to Stream-Flex API",
            "status": "success"
        }, 200

    return app