"""
SecuGen Bridge Service - Native DLL Version
A lightweight Python service that bridges your React frontend with SecuGen fingerprint scanner
Uses SecuGen FDx SDK native DLL via ctypes
"""

import sys
import os
import base64
import json
import ctypes
from ctypes import *
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# SDK paths - try both x64 and win32
SDK_PATH_X64 = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'secugen', 'FDx SDK Pro for Windows v4.3.1_J1.12', 'FDx SDK Pro for Windows v4.3.1', 'bin', 'x64'))
SDK_PATH_WIN32 = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'secugen', 'FDx SDK Pro for Windows v4.3.1_J1.12', 'FDx SDK Pro for Windows v4.3.1', 'bin', 'win32'))

# Determine which architecture to use
import platform
is_64bit = platform.machine().endswith('64')
SDK_PATH = SDK_PATH_X64 if is_64bit else SDK_PATH_WIN32
DLL_PATH = os.path.join(SDK_PATH, 'sgfplib.dll')

print(f"System Architecture: {'64-bit' if is_64bit else '32-bit'}")
print(f"SDK Path: {SDK_PATH}")
print(f"DLL Path: {DLL_PATH}")
print(f"DLL Exists: {os.path.exists(DLL_PATH)}")

# Load the native DLL
sgfplib = None
sgfpamx = None
try:
    # Add SDK path to DLL search path
    if hasattr(os, 'add_dll_directory'):
        os.add_dll_directory(SDK_PATH)
    
    # Load the algorithm DLL first (CRITICAL - must be loaded before sgfplib)
    SGFPAMX_PATH = os.path.join(SDK_PATH, 'sgfpamx.dll')
    try:
        sgfpamx = ctypes.WinDLL(SGFPAMX_PATH)
        print("✓ SecuGen algorithm DLL (sgfpamx.dll) loaded successfully")
    except Exception as e:
        print(f"✗ Failed to load algorithm DLL (sgfpamx.dll): {e}")
        print("  This DLL contains the fingerprint extraction and matching algorithms")
        sys.exit(1)
    
    # Try to load the main DLL
    sgfplib = ctypes.WinDLL(DLL_PATH)
    print("✓ SecuGen native DLL (sgfplib.dll) loaded successfully")
except Exception as e:
    print(f"✗ Failed to load SecuGen DLL: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure the SecuGen device drivers are installed")
    print("2. Check if the DLL file exists at the path above")
    print("3. Ensure you have the correct architecture (32-bit vs 64-bit)")
    print("4. Try running as Administrator")
    sys.exit(1)

# Define constants
SGFDX_ERROR_NONE = 0
SGFDX_ERROR_CREATION_FAILED = 1
SGFDX_ERROR_FUNCTION_FAILED = 2
SGFDX_ERROR_INVALID_PARAM = 3
SGFDX_ERROR_NOT_USED = 4
SGFDX_ERROR_DLLLOAD_FAILED = 5
SGFDX_ERROR_WRONGIMAGE = 6
SGFDX_ERROR_LACK_OF_BANDWIDTH = 7
SGFDX_ERROR_DEV_NOT_FOUND = 8
SGFDX_ERROR_INVALID_DEV_ID = 9
SGFDX_ERROR_TIME_OUT = 10

# Device IDs
SG_DEV_AUTO = 0xFF  # Fixed: should be 0xFF not 0xFFFF
SG_DEV_UNKNOWN = 0
SG_DEV_FDP02 = 0x01
SG_DEV_FDU02 = 0x03
SG_DEV_FDU03 = 0x04
SG_DEV_FDU04 = 0x05
SG_DEV_FDU05 = 0x06
SG_DEV_FDU06 = 0x07
SG_DEV_FDU07 = 0x08
SG_DEV_FDU08 = 0x0A
SG_DEV_FDU06AP = 0x16
SG_DEV_FDU08AL = 0x17

# Template formats
TEMPLATE_FORMAT_ANSI378 = 0x0100
TEMPLATE_FORMAT_SG400 = 0x0200
TEMPLATE_FORMAT_ISO19794 = 0x0300

ERROR_MESSAGES = {
    0: "Success",
    1: "Creation failed",
    2: "Function failed",
    3: "Invalid parameter or device not found",
    4: "Not used",
    5: "DLL load failed",
    6: "Wrong image",
    7: "Lack of bandwidth or insufficient image quality",
    8: "Device not found",
    9: "Invalid device ID",
    10: "Timeout",
    51: "System file load failed",
    52: "Chip initialize failed",
    53: "Image data dropped",
    54: "Timeout",
    55: "Device not found",
    56: "Driver load failed",
    57: "Wrong image",
    58: "USB bandwidth lack error",
    59: "Device already open",
    60: "Failed to get device serial number",
    61: "Unsupported device",
    62: "Fake finger detected",
    63: "Fake detection initialization failed",
    101: "Too few minutiae (fingerprint features)",
    102: "Invalid template type",
    103: "Error decoding template 1",
    104: "Error decoding template 2",
    105: "Extract failed",
    106: "Match failed",
}

# Define structures
class SGDeviceList(Structure):
    _fields_ = [
        ("DevName", c_ulong),
        ("DevID", c_ulong),
        ("DevType", c_ushort),
        ("DevSN", c_ubyte * 16),
    ]

class SGDeviceInfoParam(Structure):
    _fields_ = [
        ("DeviceID", c_ulong),
        ("DeviceSN", c_ubyte * 16),
        ("ComPort", c_ulong),
        ("ComSpeed", c_ulong),
        ("ImageWidth", c_ulong),
        ("ImageHeight", c_ulong),
        ("Contrast", c_ulong),
        ("Brightness", c_ulong),
        ("Gain", c_ulong),
        ("ImageDPI", c_ulong),
        ("FWVersion", c_ulong),
    ]

class SGFingerInfo(Structure):
    """Fingerprint information structure for template creation"""
    _fields_ = [
        ("FingerNumber", c_ushort),      # Finger position (0=unknown, 1-10 for specific fingers)
        ("ViewNumber", c_ushort),        # Sample/view number (0 for first capture)
        ("ImpressionType", c_ushort),    # 0=Live-scan plain, 1=Live-scan rolled, etc.
        ("ImageQuality", c_ushort),      # Image quality score (0-100)
    ]

class SecuGenDevice:
    def __init__(self):
        self.device_handle = None
        self.device_name = "SecuGen Device"
        self.is_initialized = False
        self.image_width = 0
        self.image_height = 0
        self.device_id = 0
        self.max_template_size = 1000  # Will be set during initialization
        
    def initialize(self):
        """Initialize SecuGen device using SDK sequence from working samples: Create -> Init -> OpenDevice"""
        try:
            # Step 1: Create device handle
            self.device_handle = c_void_p()
            
            # SGFPM_Create
            create_func = sgfplib.SGFPM_Create
            create_func.argtypes = [POINTER(c_void_p)]
            create_func.restype = c_long
            
            error = create_func(byref(self.device_handle))
            if error != SGFDX_ERROR_NONE:
                error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                return {
                    'success': False,
                    'message': f'Failed to create device handle: {error_msg} (Code: {error})'
                }
            
            print(f"✓ Device handle created: {self.device_handle.value}")
            
            # Step 2: Try to enumerate devices to get the actual device name
            device_name = None
            try:
                num_devices = c_ulong(0)
                device_list_ptr = POINTER(SGDeviceList)()
                
                enum_func = sgfplib.SGFPM_EnumerateDevice
                enum_func.argtypes = [c_void_p, POINTER(c_ulong), POINTER(POINTER(SGDeviceList))]
                enum_func.restype = c_long
                
                error = enum_func(self.device_handle, byref(num_devices), byref(device_list_ptr))
                
                if error == SGFDX_ERROR_NONE and num_devices.value > 0:
                    device_info = device_list_ptr[0]
                    device_name = device_info.DevName
                    print(f"✓ Found device via enumeration: 0x{device_name:02X}")
                else:
                    print(f"  EnumerateDevice returned no devices, will try common device types")
            except Exception as e:
                print(f"  EnumerateDevice failed: {e}, will try common device types")
            
            # Step 3: Initialize with device name
            # If enumeration failed, try common device types in order of popularity
            if device_name is None:
                common_devices = [
                    (SG_DEV_FDU06AP, "FDU06AP (UPx-AP)"),
                    (SG_DEV_FDU08AL, "FDU08AL (U20-AL)"),
                    (SG_DEV_FDU06, "FDU06 (UPx)"),
                    (SG_DEV_FDU07, "FDU07 (U10)"),
                    (SG_DEV_FDU08, "FDU08 (U20A)"),
                    (SG_DEV_FDU05, "FDU05 (U20)"),
                    (SG_DEV_FDU04, "FDU04 (Hamster IV)"),
                    (SG_DEV_FDU03, "FDU03 (Hamster Plus)"),
                ]
                
                print("  Trying common device types...")
                init_success = False
                
                for dev_id, dev_name in common_devices:
                    init_func = sgfplib.SGFPM_Init
                    init_func.argtypes = [c_void_p, c_ulong]
                    init_func.restype = c_long
                    
                    error = init_func(self.device_handle, dev_id)
                    if error == SGFDX_ERROR_NONE:
                        device_name = dev_id
                        print(f"  ✓ Device initialized as {dev_name}")
                        init_success = True
                        break
                    else:
                        print(f"    Not {dev_name}")
                
                if not init_success:
                    return {
                        'success': False,
                        'message': 'Failed to initialize device with any known device type. Please check:\n1. Device is connected via USB\n2. Device drivers are installed\n3. Device appears in Windows Device Manager\n4. Try unplugging and replugging the device'
                    }
            else:
                # Use enumerated device name
                init_func = sgfplib.SGFPM_Init
                init_func.argtypes = [c_void_p, c_ulong]
                init_func.restype = c_long
                
                error = init_func(self.device_handle, device_name)
                if error != SGFDX_ERROR_NONE:
                    error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                    return {
                        'success': False,
                        'message': f'Failed to initialize device: {error_msg} (Code: {error})'
                    }
                print(f"✓ Device initialized with enumerated device name")
            
            # Step 4: Open device with auto-detect ID (255 = 0xFF)
            device_id = 0xFF  # Auto-detect device ID
            
            open_func = sgfplib.SGFPM_OpenDevice
            open_func.argtypes = [c_void_p, c_ulong]
            open_func.restype = c_long
            
            error = open_func(self.device_handle, device_id)
            if error != SGFDX_ERROR_NONE:
                error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                return {
                    'success': False,
                    'message': f'Failed to open device: {error_msg} (Code: {error}). Device may be in use by another application.'
                }
            
            print(f"✓ Device opened successfully")
            self.is_initialized = True
            
            # Step 5: Turn LED off initially (will turn on during capture)
            try:
                led_func = sgfplib.SGFPM_SetLedOn
                led_func.argtypes = [c_void_p, c_bool]
                led_func.restype = c_long
                led_func(self.device_handle, False)
                print(f"  ✓ LED turned off (ready for capture)")
            except Exception as e:
                print(f"  Warning: Could not control LED: {e}")
            
            # Step 6: Get device info
            dev_info = SGDeviceInfoParam()
            get_info_func = sgfplib.SGFPM_GetDeviceInfo
            get_info_func.argtypes = [c_void_p, POINTER(SGDeviceInfoParam)]
            get_info_func.restype = c_long
            
            error = get_info_func(self.device_handle, byref(dev_info))
            if error == SGFDX_ERROR_NONE:
                try:
                    sn_bytes = bytes(dev_info.DeviceSN).rstrip(b'\x00')
                    device_sn = sn_bytes.decode('utf-8', errors='ignore')
                except:
                    device_sn = "N/A"
                
                # Map device ID to name
                device_names = {
                    0x00: "SecuGen Device (Auto-detected)",  # Unknown/Auto
                    0x01: "FDP02",
                    0x03: "FDU02 (Hamster)",
                    0x04: "FDU03 (Hamster Plus)",
                    0x05: "FDU04 (Hamster IV)",
                    0x06: "FDU05 (U20)",
                    0x07: "FDU06 (UPx)",
                    0x08: "FDU07 (U10)",
                    0x09: "FDU07A (U10-AP)",
                    0x0A: "FDU08 (U20A)",
                    0x0B: "FDU08P (U20-AP)",
                    0x0C: "FDU06P (UPx-P)",
                    0x16: "FDU06AP (UPx-AP/Hamster Pro v2)",
                    0x17: "FDU08AL (U20-AL)",
                }
                
                self.device_name = device_names.get(dev_info.DeviceID, f"Unknown Device (0x{dev_info.DeviceID:02X})")
                self.device_id = dev_info.DeviceID
                self.image_width = dev_info.ImageWidth
                self.image_height = dev_info.ImageHeight
                
                print(f"✓ Device info retrieved:")
                print(f"  Name: {self.device_name}")
                print(f"  Serial: {device_sn}")
                print(f"  Image size: {self.image_width}x{self.image_height}")
                print(f"  DPI: {dev_info.ImageDPI}")
                
                # CRITICAL: Reinitialize algorithm with actual device dimensions
                # Some devices report different dimensions than expected
                try:
                    print(f"  Reinitializing algorithm with device dimensions...")
                    # Close and reinit with correct dimensions using InitEx2
                    # This ensures the algorithm module uses the correct image size
                    init_ex2_func = sgfplib.SGFPM_InitEx2
                    init_ex2_func.argtypes = [c_void_p, c_ulong, c_ulong, c_ulong, c_char_p]
                    init_ex2_func.restype = c_long
                    
                    error = init_ex2_func(
                        self.device_handle,
                        dev_info.ImageWidth,
                        dev_info.ImageHeight,
                        dev_info.ImageDPI,
                        None  # No license file needed for device-based usage
                    )
                    
                    if error == SGFDX_ERROR_NONE:
                        print(f"  ✓ Algorithm reinitialized with device dimensions")
                    else:
                        print(f"  Note: Could not reinitialize algorithm (error {error}), using device-based init")
                except Exception as e:
                    print(f"  Note: InitEx2 not available: {e}")
                print(f"  Brightness: {dev_info.Brightness}")
                
                # Step 6a: Adjust brightness if needed (SDK manual section 3.8)
                # Default brightness varies by device, typical range is 0-100
                # Higher brightness can help with dry fingers, lower with wet fingers
                try:
                    # Set to a good default brightness (50 is usually good)
                    set_brightness_func = sgfplib.SGFPM_SetBrightness
                    set_brightness_func.argtypes = [c_void_p, c_long]
                    set_brightness_func.restype = c_long
                    brightness_error = set_brightness_func(self.device_handle, 50)
                    if brightness_error == SGFDX_ERROR_NONE:
                        print(f"  ✓ Brightness set to 50 (optimal for most conditions)")
                    else:
                        print(f"  Warning: Could not set brightness (error {brightness_error})")
                except Exception as e:
                    print(f"  Warning: SetBrightness not available: {e}")
            else:
                print(f"Warning: Could not get device info (error {error}), using defaults")
                self.device_name = "SecuGen Device"
                self.image_width = 300
                self.image_height = 400
                
                # Try to set brightness even without device info
                try:
                    set_brightness_func = sgfplib.SGFPM_SetBrightness
                    set_brightness_func.argtypes = [c_void_p, c_long]
                    set_brightness_func.restype = c_long
                    set_brightness_func(self.device_handle, 50)
                except:
                    pass
            
            # Step 7: Get max template size (don't set format yet - use default SG400)
            # Get max template size (CRITICAL for template creation)
            max_template_size = c_ulong()
            get_max_size_func = sgfplib.SGFPM_GetMaxTemplateSize
            get_max_size_func.argtypes = [c_void_p, POINTER(c_ulong)]
            get_max_size_func.restype = c_long
            
            error = get_max_size_func(self.device_handle, byref(max_template_size))
            if error == SGFDX_ERROR_NONE:
                self.max_template_size = max_template_size.value
                print(f"  Max template size: {self.max_template_size} bytes")
            else:
                # Use default if we can't get it
                self.max_template_size = 1000
                print(f"  Warning: Could not get max template size (error {error}), using default: {self.max_template_size}")
            
            return {
                'success': True,
                'message': 'Device initialized successfully',
                'device_name': self.device_name,
                'width': self.image_width,
                'height': self.image_height
            }
                
        except Exception as e:
            import traceback
            return {
                'success': False,
                'message': f'Failed to initialize device: {str(e)}\n{traceback.format_exc()}'
            }
    
    def get_device_info(self):
        """Get device information"""
        if not self.is_initialized:
            init_result = self.initialize()
            if not init_result['success']:
                return init_result
        
        try:
            return {
                'success': True,
                'device_name': self.device_name,
                'width': self.image_width,
                'height': self.image_height,
                'status': 'ready'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to get device info: {str(e)}'
            }
    
    def capture_fingerprint(self, quality_threshold=50, timeout=10000):
        """Capture fingerprint and return template data"""
        if not self.is_initialized:
            init_result = self.initialize()
            if not init_result['success']:
                return init_result
        
        try:
            # Turn LED on to indicate capture is starting
            try:
                led_func = sgfplib.SGFPM_SetLedOn
                led_func.argtypes = [c_void_p, c_bool]
                led_func.restype = c_long
                led_func(self.device_handle, True)
            except:
                pass
            
            # Create image buffer
            image_size = self.image_width * self.image_height
            image_buffer = (c_ubyte * image_size)()
            
            print(f"Capturing fingerprint (buffer size: {image_size})...")
            print("Please place your finger on the scanner...")
            
            # Use GetImageEx with timeout and quality threshold
            # SDK Manual 3.6: GetImageEx captures continuously until quality threshold is met
            get_image_ex_func = sgfplib.SGFPM_GetImageEx
            get_image_ex_func.argtypes = [c_void_p, POINTER(c_ubyte), c_ulong, c_void_p, c_ulong]
            get_image_ex_func.restype = c_long
            
            # Call GetImageEx (hwnd=NULL for no display, quality threshold)
            # This will wait for finger placement and capture when quality >= threshold
            error = get_image_ex_func(self.device_handle, image_buffer, timeout, None, quality_threshold)
            
            if error != SGFDX_ERROR_NONE:
                error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                
                # Turn LED off on error
                try:
                    led_func = sgfplib.SGFPM_SetLedOn
                    led_func.argtypes = [c_void_p, c_bool]
                    led_func.restype = c_long
                    led_func(self.device_handle, False)
                except:
                    pass
                
                if error == SGFDX_ERROR_TIME_OUT:
                    return {
                        'success': False,
                        'message': f'Capture timeout. Please place your finger on the scanner and try again.'
                    }
                
                return {
                    'success': False,
                    'message': f'Failed to capture fingerprint: {error_msg} (Code: {error})'
                }
            
            print("✓ Image captured successfully")
            
            # Get image quality BEFORE creating template
            quality = c_long()
            get_quality_func = sgfplib.SGFPM_GetImageQuality
            get_quality_func.argtypes = [c_void_p, c_ulong, c_ulong, POINTER(c_ubyte), POINTER(c_long)]
            get_quality_func.restype = c_long
            
            error = get_quality_func(self.device_handle, self.image_width, self.image_height, image_buffer, byref(quality))
            quality_score = quality.value if error == SGFDX_ERROR_NONE else 0
            
            print(f"  Image quality: {quality_score}")
            
            # Check if quality is acceptable (SDK recommends 50+ for good quality)
            if quality_score < 30:  # Low threshold - below this, template creation likely fails
                # Turn LED off on quality failure
                try:
                    led_func = sgfplib.SGFPM_SetLedOn
                    led_func.argtypes = [c_void_p, c_bool]
                    led_func.restype = c_long
                    led_func(self.device_handle, False)
                except:
                    pass
                
                return {
                    'success': False,
                    'message': f'Fingerprint quality too low: {quality_score}/100.\n\nTips for better capture:\n1. Clean the scanner with a soft, dry cloth\n2. Ensure your finger is clean and dry (not wet or oily)\n3. Press firmly and evenly on the scanner\n4. Center your finger on the scanner surface\n5. Keep your finger still during capture\n6. Try a different finger if problems persist',
                    'quality': quality_score
                }
            
            # Warn if quality is marginal but continue
            if quality_score < 50:
                print(f"  WARNING: Quality is marginal ({quality_score}/100), template creation may fail")
            
            # Create template from image
            # CRITICAL: For SG400 format, pass 0 (not None) for fpInfo parameter
            # Sample code shows: SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_FetBuf)
            print(f"  Attempting template creation...")
            print(f"  Using image: {self.image_width}x{self.image_height} = {len(image_buffer)} bytes")
            
            # Create template buffer
            template_buffer = (c_ubyte * self.max_template_size)()
            
            # SGFPM_CreateTemplate - pass 0 (cast to void*) for fpInfo when using SG400
            create_template_func = sgfplib.SGFPM_CreateTemplate
            create_template_func.argtypes = [c_void_p, c_void_p, POINTER(c_ubyte), POINTER(c_ubyte)]
            create_template_func.restype = c_long
            
            # Pass 0 (not None) for fpInfo parameter with SG400 format
            error = create_template_func(self.device_handle, c_void_p(0), image_buffer, template_buffer)
            
            if error == SGFDX_ERROR_NONE:
                print(f"  ✓ Template created successfully")
                
                # Get actual template size
                template_size = c_ulong()
                get_size_func = sgfplib.SGFPM_GetTemplateSize
                get_size_func.argtypes = [c_void_p, POINTER(c_ubyte), POINTER(c_ulong)]
                get_size_func.restype = c_long
                
                size_error = get_size_func(self.device_handle, template_buffer, byref(template_size))
                if size_error == SGFDX_ERROR_NONE:
                    actual_size = template_size.value
                    print(f"  Template size: {actual_size} bytes")
                    template_bytes = bytes(template_buffer[:actual_size])
                else:
                    print(f"  Warning: Could not get template size, using full buffer")
                    template_bytes = bytes(template_buffer)
                
                template_base64 = base64.b64encode(template_bytes).decode('utf-8')
                image_bytes = bytes(image_buffer)
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                
                return {
                    'success': True,
                    'templateData': template_base64,
                    'imageData': image_base64,
                    'quality': quality_score,
                    'format': 'SG400',
                    'message': f'Fingerprint captured successfully'
                }
            else:
                error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                print(f"  ✗ CreateTemplate failed: {error_msg} (Code: {error})")
                print(f"  DEBUG: device_handle={self.device_handle.value}, image_size={len(image_buffer)}, template_size={self.max_template_size}")
                print(f"  DEBUG: image dimensions={self.image_width}x{self.image_height}, quality={quality_score}")
            
            # If default format failed, try multiple template formats
            template_formats = [
                (0x0200, "SG400"),      # SecuGen native format (most reliable)
                (0x0100, "ANSI378"),    # ANSI format
                (0x0300, "ISO19794"),   # ISO format
            ]
            
            template_created = False
            template_base64 = None
            format_used = None
            
            for format_code, format_name in template_formats:
                print(f"  Trying template format: {format_name} (0x{format_code:04X})")
                
                # Set template format
                try:
                    set_format_func = sgfplib.SGFPM_SetTemplateFormat
                    set_format_func.argtypes = [c_void_p, c_ushort]
                    set_format_func.restype = c_long
                    error = set_format_func(self.device_handle, format_code)
                    if error != SGFDX_ERROR_NONE:
                        error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                        print(f"    Could not set format {format_name}: {error_msg} (Code: {error})")
                        continue
                    print(f"    Format set successfully")
                except Exception as e:
                    print(f"    Format {format_name} not available: {e}")
                    continue
                
                # Create template buffer
                template_buffer = (c_ubyte * self.max_template_size)()
                
                # SGFPM_CreateTemplate
                create_template_func = sgfplib.SGFPM_CreateTemplate
                create_template_func.restype = c_long
                
                # For SG400: pass 0 (c_void_p(0)) for fpInfo
                # For ANSI/ISO: pass pointer to SGFingerInfo
                if format_code == 0x0200:  # SG400
                    create_template_func.argtypes = [c_void_p, c_void_p, POINTER(c_ubyte), POINTER(c_ubyte)]
                    error = create_template_func(self.device_handle, c_void_p(0), image_buffer, template_buffer)
                else:  # ANSI378 or ISO19794
                    # Populate SGFingerInfo for ANSI/ISO formats
                    finger_info = SGFingerInfo()
                    finger_info.FingerNumber = 0
                    finger_info.ViewNumber = 0  # 0 for first sample/view
                    finger_info.ImpressionType = 0
                    finger_info.ImageQuality = quality_score
                    
                    create_template_func.argtypes = [c_void_p, POINTER(SGFingerInfo), POINTER(c_ubyte), POINTER(c_ubyte)]
                    error = create_template_func(self.device_handle, byref(finger_info), image_buffer, template_buffer)
                
                if error == SGFDX_ERROR_NONE:
                    print(f"  ✓ Template created successfully using {format_name}")
                    
                    # Get actual template size
                    template_size = c_ulong()
                    get_size_func = sgfplib.SGFPM_GetTemplateSize
                    get_size_func.argtypes = [c_void_p, POINTER(c_ubyte), POINTER(c_ulong)]
                    get_size_func.restype = c_long
                    
                    size_error = get_size_func(self.device_handle, template_buffer, byref(template_size))
                    if size_error == SGFDX_ERROR_NONE:
                        actual_size = template_size.value
                        print(f"  Template size: {actual_size} bytes")
                        template_bytes = bytes(template_buffer[:actual_size])
                    else:
                        # Use full buffer if we can't get size
                        template_bytes = bytes(template_buffer)
                    
                    template_base64 = base64.b64encode(template_bytes).decode('utf-8')
                    format_used = format_name
                    template_created = True
                    break
                else:
                    error_msg = ERROR_MESSAGES.get(error, f"Unknown error {error}")
                    print(f"    CreateTemplate failed with {format_name}: {error_msg} (Code: {error})")
            
            # If no template format worked, return error with image data for debugging
            if not template_created:
                # Turn LED off on template creation failure
                try:
                    led_func = sgfplib.SGFPM_SetLedOn
                    led_func.argtypes = [c_void_p, c_bool]
                    led_func.restype = c_long
                    led_func(self.device_handle, False)
                except:
                    pass
                
                # Return the image anyway so user can see what was captured
                image_bytes = bytes(image_buffer)
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                
                return {
                    'success': False,
                    'message': f'Failed to create template with any format despite good image quality ({quality_score}/100). This may indicate:\n1. SDK algorithm issue with this specific fingerprint\n2. Device firmware compatibility issue\n3. Try a different finger\n\nImage was captured successfully and is included for debugging.',
                    'quality': quality_score,
                    'imageData': image_base64
                }
            
            # Convert image to base64
            image_bytes = bytes(image_buffer)
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            
            # Turn LED off after successful capture
            try:
                led_func = sgfplib.SGFPM_SetLedOn
                led_func.argtypes = [c_void_p, c_bool]
                led_func.restype = c_long
                led_func(self.device_handle, False)
            except:
                pass
            
            return {
                'success': True,
                'templateData': template_base64,
                'imageData': image_base64,
                'quality': quality_score,
                'format': format_used,
                'message': f'Fingerprint captured successfully using {format_used} format'
            }
            
        except Exception as e:
            # Turn LED off on error
            try:
                led_func = sgfplib.SGFPM_SetLedOn
                led_func.argtypes = [c_void_p, c_bool]
                led_func.restype = c_long
                led_func(self.device_handle, False)
            except:
                pass
            
            import traceback
            error_trace = traceback.format_exc()
            print(f"Capture exception: {error_trace}")
            return {
                'success': False,
                'message': f'Capture failed: {str(e)}'
            }
    
    def match_templates(self, template1_base64, template2_base64):
        """Match two fingerprint templates"""
        if not self.is_initialized:
            init_result = self.initialize()
            if not init_result['success']:
                return init_result
        
        try:
            # Decode base64 templates
            template1_bytes = base64.b64decode(template1_base64)
            template2_bytes = base64.b64decode(template2_base64)
            
            template1_buffer = (c_ubyte * len(template1_bytes))(*template1_bytes)
            template2_buffer = (c_ubyte * len(template2_bytes))(*template2_bytes)
            
            # SGFPM_MatchTemplate
            match_func = sgfplib.SGFPM_MatchTemplate
            match_func.argtypes = [c_void_p, POINTER(c_ubyte), POINTER(c_ubyte), c_long, POINTER(c_bool)]
            match_func.restype = c_long
            
            matched = c_bool()
            security_level = 3  # SL_NORMAL
            
            error = match_func(self.device_handle, template1_buffer, template2_buffer, security_level, byref(matched))
            
            if error != SGFDX_ERROR_NONE:
                return {
                    'success': False,
                    'message': f'Template matching failed: Error code {error}'
                }
            
            return {
                'success': True,
                'matched': bool(matched.value),
                'score': 0
            }
            
        except Exception as e:
            import traceback
            return {
                'success': False,
                'message': f'Matching failed: {str(e)}\n{traceback.format_exc()}'
            }
    
    def close(self):
        """Close device connection"""
        if self.device_handle and self.is_initialized:
            try:
                close_func = sgfplib.SGFPM_CloseDevice
                close_func.argtypes = [c_void_p]
                close_func.restype = c_long
                close_func(self.device_handle)
                
                terminate_func = sgfplib.SGFPM_Terminate
                terminate_func.argtypes = [c_void_p]
                terminate_func.restype = c_long
                terminate_func(self.device_handle)
                
                self.is_initialized = False
            except:
                pass

# Global device instance
secugen_device = SecuGenDevice()

# API Routes

@app.route('/api/device/info', methods=['POST', 'GET'])
def get_device_info():
    """Get device information"""
    result = secugen_device.get_device_info()
    return jsonify(result)

@app.route('/api/device/capture', methods=['POST'])
def capture_fingerprint():
    """Capture fingerprint"""
    data = request.get_json() or {}
    quality_threshold = data.get('quality_threshold', 50)
    timeout = data.get('timeout', 10000)
    
    result = secugen_device.capture_fingerprint(quality_threshold, timeout)
    return jsonify(result)

@app.route('/api/device/match', methods=['POST'])
def match_templates():
    """Match two fingerprint templates"""
    data = request.get_json()
    
    if not data or 'template1' not in data or 'template2' not in data:
        return jsonify({
            'success': False,
            'message': 'Missing template1 or template2 in request'
        }), 400
    
    result = secugen_device.match_templates(data['template1'], data['template2'])
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'service': 'SecuGen Bridge (Native)',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("=" * 60)
    print("SecuGen Bridge Service (Native DLL)")
    print("=" * 60)
    print(f"SDK Path: {SDK_PATH}")
    print("Starting service on http://localhost:8080")
    print("Initializing SecuGen device...")
    
    # Initialize device on startup
    init_result = secugen_device.initialize()
    if init_result['success']:
        print(f"✓ Device initialized: {init_result.get('device_name', 'Unknown')}")
        print(f"  Image size: {init_result.get('width')}x{init_result.get('height')}")
    else:
        print(f"✗ Device initialization failed: {init_result['message']}")
        print("  Service will still start, but device may not be available.")
    
    print("\nEndpoints:")
    print("  GET/POST /api/device/info    - Get device information")
    print("  POST     /api/device/capture - Capture fingerprint")
    print("  POST     /api/device/match   - Match two templates")
    print("  GET      /health             - Health check")
    print("\nPress Ctrl+C to stop")
    print("=" * 60)
    
    try:
        app.run(host='0.0.0.0', port=8080, debug=False)
    finally:
        secugen_device.close()
