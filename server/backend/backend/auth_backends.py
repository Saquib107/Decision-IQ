# backend/auth_backends.py
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from bson import ObjectId

from backend.mongo import users_collection


class MongoUser:
    """Lightweight user object that mimics Django's request.user interface."""

    is_authenticated = True
    is_anonymous = False

    def __init__(self, user_doc: dict):
        self._doc = user_doc
        self.id = str(user_doc["_id"])
        self.username = user_doc.get("username", "")
        self.email = user_doc.get("email", "")

    def __str__(self):
        return self.username


class MongoJWTAuthentication(BaseAuthentication):
    """
    Authenticate requests by reading a Bearer JWT from the Authorization header.
    The token payload must contain a 'user_id' claim that maps to a MongoDB _id.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None  # Let the request through; permission classes will reject it

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        user_id = payload.get("user_id")
        if not user_id:
            raise AuthenticationFailed("Token payload missing 'user_id'.")

        try:
            user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
        except Exception:
            raise AuthenticationFailed("Invalid user_id in token.")

        if not user_doc:
            raise AuthenticationFailed("User not found.")

        return (MongoUser(user_doc), token)

    def authenticate_header(self, request):
        return "Bearer"
