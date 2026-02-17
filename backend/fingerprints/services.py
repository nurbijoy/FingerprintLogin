"""
Fingerprint matching service using SecuGen Bridge with optimized parallel matching
"""
import requests
import base64
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
import time


class FingerprintService:
    """
    Service for fingerprint template matching via SecuGen Bridge
    Implements parallel matching for optimal performance
    """
    BRIDGE_URL = 'http://localhost:8080/api/device'
    MAX_WORKERS = 10  # Number of parallel matching threads
    MATCH_THRESHOLD = 85  # Confidence threshold for early termination
    REQUEST_TIMEOUT = 3  # Reduced timeout for faster failure detection
    
    @staticmethod
    def _match_single_template(template1_base64, fingerprint):
        """
        Match a single template against stored fingerprint
        
        Args:
            template1_base64: Base64 encoded captured template
            fingerprint: Fingerprint object to match against
            
        Returns:
            dict: Match result with user and confidence, or None if no match
        """
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
                timeout=FingerprintService.REQUEST_TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success') and result.get('matched'):
                    confidence = result.get('score', 95)
                    return {
                        'matched': True,
                        'user': fingerprint.user,
                        'confidence': confidence,
                        'fingerprint_id': fingerprint.id
                    }
        except requests.exceptions.Timeout:
            print(f"Timeout matching fingerprint {fingerprint.id}")
        except Exception as e:
            print(f"Error matching fingerprint {fingerprint.id}: {str(e)}")
        
        return None

    @staticmethod
    def verify_fingerprint(template_bytes, stored_fingerprints):
        """
        Verify a fingerprint template against stored templates using parallel matching
        
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
        start_time = time.time()
        
        # Convert captured template to base64 once
        template1_base64 = base64.b64encode(template_bytes).decode('utf-8')
        
        # Convert QuerySet to list for efficient iteration
        fingerprints_list = list(stored_fingerprints.select_related('user'))
        total_fingerprints = len(fingerprints_list)
        
        if total_fingerprints == 0:
            return {
                'matched': False,
                'user': None,
                'confidence': 0
            }
        
        print(f"Starting parallel matching against {total_fingerprints} fingerprints...")
        
        best_match = None
        matched_count = 0
        
        # Use ThreadPoolExecutor for parallel matching
        with ThreadPoolExecutor(max_workers=FingerprintService.MAX_WORKERS) as executor:
            # Submit all matching tasks
            future_to_fingerprint = {
                executor.submit(
                    FingerprintService._match_single_template,
                    template1_base64,
                    fingerprint
                ): fingerprint
                for fingerprint in fingerprints_list
            }
            
            # Process results as they complete (early termination possible)
            for future in as_completed(future_to_fingerprint):
                result = future.result()
                
                if result and result['matched']:
                    matched_count += 1
                    
                    # Keep track of best match
                    if best_match is None or result['confidence'] > best_match['confidence']:
                        best_match = result
                    
                    # Early termination: if we find a high-confidence match, stop
                    if result['confidence'] >= FingerprintService.MATCH_THRESHOLD:
                        print(f"High-confidence match found (score: {result['confidence']}), terminating early")
                        # Cancel remaining futures
                        for f in future_to_fingerprint:
                            f.cancel()
                        break
        
        elapsed_time = time.time() - start_time
        print(f"Matching completed in {elapsed_time:.2f}s - Checked {total_fingerprints} templates, found {matched_count} matches")
        
        if best_match:
            return {
                'matched': True,
                'user': best_match['user'],
                'confidence': best_match['confidence']
            }
        
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
