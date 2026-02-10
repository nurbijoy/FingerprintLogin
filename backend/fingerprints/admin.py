from django.contrib import admin
from .models import Fingerprint


@admin.register(Fingerprint)
class FingerprintAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'quality_score', 'created_at']
    list_filter = ['created_at', 'quality_score']
    search_fields = ['user__emp_id', 'user__name']
