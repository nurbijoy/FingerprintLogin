from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FingerprintViewSet

router = DefaultRouter()
router.register(r'', FingerprintViewSet, basename='fingerprint')

urlpatterns = [
    path('', include(router.urls)),
]
