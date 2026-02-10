from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['emp_id', 'name', 'created_at']
    search_fields = ['emp_id', 'name']
    list_filter = ['created_at']
