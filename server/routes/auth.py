from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import UserModel

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
        
    user_id = UserModel.create_user(data['email'], data['password'])
    if not user_id:
        return jsonify({"error": "User already exists with that email"}), 400
        
    access_token = create_access_token(identity=user_id)
    return jsonify({
        "message": "Registered successfully", 
        "token": access_token,
        "user": {"email": data['email'], "id": user_id}
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
        
    user = UserModel.verify_password(data['email'], data['password'])
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
        
    access_token = create_access_token(identity=user['_id'])
    return jsonify({
        "message": "Logged in successfully", 
        "token": access_token,
        "user": {"email": user['email'], "id": user['_id']}
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = UserModel.get_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({"user": {"email": user['email'], "id": user['_id']}}), 200
