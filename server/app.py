import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from database import init_db

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize JWT and Database
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'fallback-super-secret-key')
    jwt = JWTManager(app)
    init_db()

    try:
        # Import Blueprints
        from routes.places import places_bp
        from routes.auth import auth_bp

        # Register Blueprints
        app.register_blueprint(places_bp, url_prefix='/api')
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
    except Exception as e:
        print("Failed to register blueprints:", e)

    @app.route('/')
    def index():
        return jsonify({"status": "ok", "message": "Welcome to Nearify API"}), 200

    @app.route('/health')
    def health_check():
        return jsonify({"status": "ok", "message": "Nearify API running"}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
