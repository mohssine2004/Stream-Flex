from flask import Flask, jsonify
from .config import Config
from .extensions import db, migrate, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/*": {
            "origins": "*",
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    }, supports_credentials=True)

    # Register a simple health check route
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "success", "message": "Backend is running successfully!"})

    # Base route to avoid 404 on the root URL
    @app.route('/')
    def index():
        return jsonify({
            "status": "success", 
            "message": "Welcome to Stream-Flex API",
            "endpoints": ["/api/health", "/api/videos"]
        })

    # Register video_routes blueprint
    from .routes.video_routes import video_bp
    app.register_blueprint(video_bp, url_prefix='/api/videos')

    # Register auth_routes blueprint
    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api')

    # Register admin_routes blueprint
    from .routes.admin_routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    return app
