import bcrypt
from datetime import datetime
from bson.objectid import ObjectId
from database import get_db

class UserModel:
    @staticmethod
    def create_user(email, password):
        db = get_db()
        # Check if exists
        if db.users.find_one({"email": email.lower()}):
            return None # Already exists
            
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_doc = {
            "email": email.lower(),
            "password": hashed_pw.decode('utf-8'),
            "created_at": datetime.utcnow()
        }
        result = db.users.insert_one(user_doc)
        return str(result.inserted_id)
        
    @staticmethod
    def verify_password(email, password):
        db = get_db()
        user = db.users.find_one({"email": email.lower()})
        if not user:
            return None
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            user['_id'] = str(user['_id'])
            del user['password']
            return user
        return None
        
    @staticmethod
    def get_by_id(user_id):
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            del user['password']
        return user

class FavoriteModel:
    @staticmethod
    def add_favorite(user_id, place_data):
        db = get_db()
        # Check if already favored
        existing = db.favorites.find_one({
            "user_id": user_id, 
            "place_id": place_data['id']
        })
        
        if existing:
            return False # Already exists

        doc = {
            "user_id": user_id,
            "place_id": place_data['id'],
            "data": place_data,
            "added_at": datetime.utcnow()
        }
        db.favorites.insert_one(doc)
        return True
        
    @staticmethod
    def remove_favorite(user_id, place_id):
        db = get_db()
        result = db.favorites.delete_one({
            "user_id": user_id,
            "place_id": place_id
        })
        return result.deleted_count > 0

    @staticmethod
    def get_user_favorites(user_id):
        db = get_db()
        favs = list(db.favorites.find({"user_id": user_id}))
        # Return just the place data array as the frontend expects
        return [fav['data'] for fav in favs]
