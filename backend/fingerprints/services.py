"""
Fingerprint matching service using SecuGen Bridge
"""
import requests
import base64


class FingerprintService:
    """
    Service for fingerprint template matching via SecuGen Bridge
    """
    BRIDGE_URL = 'http://localhost:8080/api/device'

    @staticmethod
    def verify_fingerprint(template_bytes, stored_fingerprints):
        """
        Verify a fingerprint template against stored templates
        
        Args:
            template_bytes: Binary fingerprint template data
            stored_fingerprints: QuerySet of Fingerprint objects
        
        Returns:
            dict: {
                'matched': bool,
                'user': User object if matched,
                'confidence': int (0-100)
            }
        """
        # Convert captured template to base64
        template1_base64 = base64.b64encode(template_bytes).decode('utf-8')
        
        # Try to match against each stored fingerprint
        for fingerprint in stored_fingerprints:
            try:
                # Convert stored template to base64
                template2_base64 = base64.b64encode(fingerprint.template_data).decode('utf-8')
                
                # Call SecuGen Bridge to match templates
                response = requests.post(
                    f'{FingerprintService.BRIDGE_URL}/match',
                    json={
                        'template1': template1_base64,
                        'template2': template2_base64
                    },
                    timeout=5
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get('success') and result.get('matched'):
                        return {
                            'matched': True,
                            'user': fingerprint.user,
                            'confidence': result.get('score', 95)
                        }
            except Exception as e:
                print(f"Error matching fingerprint {fingerprint.id}: {str(e)}")
                continue
        
        return {
            'matched': False,
            'user': None,
            'confidence': 0
        }

    @staticmethod
    def extract_template(raw_image_data):
        """
        Extract fingerprint template from raw image
        This is handled by the SecuGen Bridge during capture
        """
        return raw_image_data

    @staticmethod
    def calculate_quality(template_data):
        """
        Calculate fingerprint quality score
        This is handled by the SecuGen Bridge during capture
        """
        return 80
