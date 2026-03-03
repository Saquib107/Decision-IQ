# backend/mongo.py
import os
import jwt
import datetime
import bcrypt
from pymongo import MongoClient
from django.conf import settings

# Initialize client using settings if available, otherwise env
try:
    MONGO_URI = getattr(settings, "MONGO_URI", os.environ.get("MONGODB_URI"))
    MONGO_DB_NAME = getattr(settings, "MONGO_DB_NAME", os.environ.get("MONGO_DB_NAME", "decision_iq_db"))
except Exception:
    MONGO_URI = os.environ.get("MONGODB_URI")
    MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "decision_iq_db")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

decisions_collection = db["decisions"]
users_collection = db["users"]

# --- Helpers ---

def make_token(user_id: str) -> str:
    from datetime import timezone
    now = datetime.datetime.now(tz=timezone.utc)
    payload = {
        "user_id": user_id, 
        "iat": now,
        "exp": now + datetime.timedelta(minutes=int(os.environ.get("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", 60))),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def check_password(plain: str, hashed: str) -> bool:
    if hashed.startswith('pbkdf2_sha256$'):
        from django.contrib.auth.hashers import check_password as django_check_password
        return django_check_password(plain, hashed)
    return bcrypt.checkpw(plain.encode(), hashed.encode())
