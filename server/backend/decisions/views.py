# decisions/views.py
import traceback
from bson import ObjectId
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.mongo import (
    users_collection, 
    decisions_collection, 
    make_token, 
    hash_password, 
    check_password
)
from .serializers import UserRegistrationSerializer, UserLoginSerializer

# ─── Auth Views ─────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            print(f"DEBUG: Registering user: {request.data.get('username')}")
            serializer = UserRegistrationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            data = serializer.validated_data
            username = data["username"]
            email = data.get("email", "")
            password = data["password"]
            
            if users_collection.find_one({"username": username}):
                return Response({"username": "A user with this username already exists."}, status=status.HTTP_400_BAD_REQUEST)
            
            hashed = hash_password(password)
            result = users_collection.insert_one({"username": username, "email": email, "password": hashed})
            return Response({"message": "User registered successfully", "id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            if not serializer.is_valid(): return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            data = serializer.validated_data
            user_doc = users_collection.find_one({"username": data["username"]})
            if not user_doc or not check_password(data["password"], user_doc["password"]):
                return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)
            token = make_token(str(user_doc["_id"]))
            return Response({"access": token})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ─── Profile Views ───────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({"id": user.id, "username": user.username, "email": user.email})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_me(request):
    user = request.user
    new_username = request.data.get("username")
    new_email = request.data.get("email")
    update_fields = {}
    if new_username:
        existing = users_collection.find_one({"username": new_username})
        if existing and str(existing["_id"]) != user.id:
            return Response({"username": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
        update_fields["username"] = new_username
    if new_email: update_fields["email"] = new_email
    if update_fields:
        users_collection.update_one({"_id": ObjectId(user.id)}, {"$set": update_fields})
    updated = users_collection.find_one({"_id": ObjectId(user.id)})
    return Response({"username": updated["username"], "email": updated.get("email", "")})

# ─── Decision Views ──────────────────────────────────────────────────────────

class DecisionListCreate(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = request.user.id
        docs = list(decisions_collection.find({"user_id": user_id}))
        for d in docs: d["id"] = str(d.pop("_id"))
        return Response(docs)
    def post(self, request):
        user_id = request.user.id
        data = request.data.copy()
        data["user_id"] = user_id
        data.setdefault("outcome", None)
        result = decisions_collection.insert_one(data)
        data["id"] = str(result.inserted_id)
        data.pop("_id", None)
        return Response(data, status=status.HTTP_201_CREATED)

class DecisionDetail(APIView):
    permission_classes = [IsAuthenticated]
    def _get_doc(self, user_id, pk):
        doc = decisions_collection.find_one({"_id": ObjectId(pk), "user_id": user_id})
        if not doc: return None
        doc["id"] = str(doc.pop("_id"))
        return doc
    def patch(self, request, pk):
        user_id = request.user.id
        decisions_collection.update_one({"_id": ObjectId(pk), "user_id": user_id}, {"$set": request.data})
        doc = self._get_doc(user_id, pk)
        if not doc: return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(doc)
    def delete(self, request, pk):
        user_id = request.user.id
        decisions_collection.delete_one({"_id": ObjectId(pk), "user_id": user_id})
        return Response(status=status.HTTP_204_NO_CONTENT)
