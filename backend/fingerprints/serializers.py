from rest_framework import serializers
from .models import Fingerprint
from users.serializers import UserSerializer
import base64


class FingerprintSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    template_data_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Fingerprint
        fields = ['id', 'user', 'quality_score', 'created_at', 'template_data_base64']
        read_only_fields = ['id', 'created_at']

    def get_template_data_base64(self, obj):
        return base64.b64encode(obj.template_data).decode('utf-8')


class FingerprintCaptureSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    template_data = serializers.CharField()
    quality_score = serializers.IntegerField(default=0)

    def validate_template_data(self, value):
        try:
            base64.b64decode(value)
        except Exception:
            raise serializers.ValidationError("Invalid base64 template data")
        return value


class FingerprintVerifySerializer(serializers.Serializer):
    template_data = serializers.CharField()

    def validate_template_data(self, value):
        try:
            base64.b64decode(value)
        except Exception:
            raise serializers.ValidationError("Invalid base64 template data")
        return value
