from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Fingerprint
from users.models import User
from .serializers import (
    FingerprintSerializer,
    FingerprintCaptureSerializer,
    FingerprintVerifySerializer
)
from .services import FingerprintService
import base64


class FingerprintViewSet(viewsets.ModelViewSet):
    queryset = Fingerprint.objects.all()
    serializer_class = FingerprintSerializer

    @action(detail=False, methods=['post'])
    def capture(self, request):
        """Capture and store fingerprint template"""
        print(f"Received capture request with data: {request.data}")
        serializer = FingerprintCaptureSerializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            return Response(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_id = serializer.validated_data['user_id']
        template_data = serializer.validated_data['template_data']
        quality_score = serializer.validated_data.get('quality_score', 0)
        
        print(f"Validated data - user_id: {user_id}, template_length: {len(template_data)}, quality: {quality_score}")

        try:
            user = User.objects.get(id=user_id)
            print(f"Found user: {user.emp_id} - {user.name}")
        except User.DoesNotExist:
            print(f"User not found with id: {user_id}")
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Decode base64 template data
            template_bytes = base64.b64decode(template_data)
            print(f"Template data decoded successfully, length: {len(template_bytes)} bytes")
        except Exception as e:
            print(f"Base64 decode error: {str(e)}")
            return Response(
                {'error': 'Invalid base64 template data', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for duplicate fingerprint
        print("Checking for duplicate fingerprint...")
        all_fingerprints = Fingerprint.objects.all()
        total_fingerprints = all_fingerprints.count()
        
        if total_fingerprints > 0:
            print(f"Comparing against {total_fingerprints} stored fingerprints...")
        
        match_result = FingerprintService.verify_fingerprint(template_bytes, all_fingerprints)
        
        if match_result['matched']:
            existing_user = match_result['user']
            print(f"Duplicate fingerprint detected! Matches user: {existing_user.emp_id}")
            return Response(
                {
                    'error': 'Duplicate fingerprint detected',
                    'message': f'This fingerprint is already registered to {existing_user.name} (ID: {existing_user.emp_id})',
                    'existing_user': {
                        'id': existing_user.id,
                        'emp_id': existing_user.emp_id,
                        'name': existing_user.name
                    }
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create fingerprint record
        fingerprint = Fingerprint.objects.create(
            user=user,
            template_data=template_bytes,
            quality_score=quality_score
        )
        
        print(f"Fingerprint created successfully with id: {fingerprint.id}")

        return Response(
            {
                'id': fingerprint.id,
                'message': 'Fingerprint captured successfully',
                'user': {
                    'id': user.id,
                    'emp_id': user.emp_id,
                    'name': user.name
                }
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'])
    def verify(self, request):
        """Verify fingerprint against stored templates"""
        serializer = FingerprintVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        template_data = serializer.validated_data['template_data']
        template_bytes = base64.b64decode(template_data)

        # Get all stored fingerprints
        stored_fingerprints = Fingerprint.objects.all()

        # Use fingerprint service to match
        match_result = FingerprintService.verify_fingerprint(
            template_bytes,
            stored_fingerprints
        )

        if match_result['matched']:
            user = match_result['user']
            return Response({
                'matched': True,
                'user': {
                    'id': user.id,
                    'emp_id': user.emp_id,
                    'name': user.name
                },
                'confidence': match_result['confidence']
            })
        else:
            return Response({
                'matched': False,
                'message': 'No matching fingerprint found'
            })

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_fingerprints(self, request, user_id=None):
        """Get all fingerprints for a specific user"""
        try:
            user = User.objects.get(id=user_id)
            fingerprints = Fingerprint.objects.filter(user=user)
            serializer = self.get_serializer(fingerprints, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
