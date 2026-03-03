# backend/urls.py
from django.urls import path, include

urlpatterns = [
    # All app routes: auth (register, login), me, decisions
    path("api/", include("decisions.urls")),
]
