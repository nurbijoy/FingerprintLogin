/**
 * SecuGen Bridge Service
 * Connects to our custom Python bridge service that interfaces with SecuGen SDK
 * No need for SecuGen WebAPI - we built our own!
 */

class SecuGenService {
  constructor() {
    // Our custom bridge service
    this.baseURL = 'http://localhost:8080/api/device';
    this.timeout = 10000; // 10 seconds
  }

  /**
   * Initialize and check if SecuGen device is available
   */
  async initialize() {
    try {
      const response = await fetch(`${this.baseURL}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Bridge service not responding');
      }

      const data = await response.json();
      console.log('SecuGen device info:', data);
      
      if (data.success) {
        return { 
          success: true, 
          message: 'Device initialized successfully',
          deviceInfo: data
        };
      } else {
        throw new Error(data.message || 'Device initialization failed');
      }
    } catch (error) {
      console.error('Device initialization failed:', error);
      return { 
        success: false, 
        message: 'SecuGen Bridge Service not found. Please start: python secugen-bridge/secugen_bridge_native.py',
        error: error.message
      };
    }
  }

  /**
   * Check if device is connected
   */
  async isDeviceConnected() {
    const result = await this.initialize();
    return result.success;
  }

  /**
   * Capture fingerprint from device
   * Returns base64 encoded template data
   */
  async captureFingerprint() {
    try {
      const response = await fetch(`${this.baseURL}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quality_threshold: 50,
          timeout: this.timeout
        })
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with bridge service');
      }

      const data = await response.json();
      console.log('Capture response:', data);

      if (data.success) {
        return {
          success: true,
          templateData: data.templateData,
          imageData: data.imageData,
          quality: data.quality || 0,
          message: data.message || 'Fingerprint captured successfully'
        };
      } else {
        throw new Error(data.message || 'Fingerprint capture failed');
      }
    } catch (error) {
      console.error('Capture failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to capture fingerprint'
      };
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo() {
    try {
      const response = await fetch(`${this.baseURL}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get device info');
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          model: data.device_name || 'SecuGen Device',
          serial: 'N/A',
          firmware: 'N/A',
          width: data.width,
          height: data.height,
          status: data.status
        };
      } else {
        throw new Error(data.message || 'Failed to get device info');
      }
    } catch (error) {
      console.error('Failed to get device info:', error);
      return {
        model: 'Unknown',
        serial: 'Unknown',
        firmware: 'Unknown'
      };
    }
  }

  /**
   * Match two fingerprint templates (1:1 verification)
   * @param {string} template1 - Base64 encoded template
   * @param {string} template2 - Base64 encoded template
   * @returns {Promise<{matched: boolean, score: number}>}
   */
  async matchTemplates(template1, template2) {
    try {
      const response = await fetch(`${this.baseURL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template1: template1,
          template2: template2
        })
      });

      if (!response.ok) {
        throw new Error('Failed to match templates');
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          matched: data.matched || false,
          score: data.score || 0
        };
      } else {
        throw new Error(data.message || 'Template matching failed');
      }
    } catch (error) {
      console.error('Template matching failed:', error);
      return {
        matched: false,
        score: 0,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const secuGenService = new SecuGenService();
export default secuGenService;
