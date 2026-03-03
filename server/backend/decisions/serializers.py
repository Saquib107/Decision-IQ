# decisions/serializers.py
from rest_framework import serializers


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=3, max_length=150)
    email = serializers.EmailField(required=False, default="")
    password = serializers.CharField(write_only=True, min_length=6)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
