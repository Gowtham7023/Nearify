from pymongo import MongoClient
import os

client = None
db = None

def init_db():
    global client, db
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/Nearify")
    client = MongoClient(mongo_uri)
    try:
        db = client.get_default_database()
    except Exception:
        db = client['Nearify']
    return db

def get_db():
    global db
    if db is None:
        init_db()
    return db
