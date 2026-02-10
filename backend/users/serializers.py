from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    fingerprint_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'emp_id', 'name', 'created_at', 'updated_at', 'fingerprint_count']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_fingerprint_count(self, obj):
        return obj.fingerprints.count()


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['emp_id', 'name']

    def validate_emp_id(self, value):
        if User.objects.filter(emp_id=value).exists():
            raise serializers.ValidationError("Employee ID already exists.")
        return value
