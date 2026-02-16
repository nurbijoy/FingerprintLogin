import { useState, useEffect } from 'react';
import secuGenService from '../services/secugen';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const FingerprintCapture = ({ onCapture, buttonText = 'Capture Fingerprint' }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('checking');
  const [alert, setAlert] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);

  useEffect(() => {
    initializeDevice();
  }, []);

  const initializeDevice = async () => {
    const result = await secuGenService.initialize();
    if (result.success) {
      setDeviceStatus('ready');
    } else {
      setDeviceStatus('error');
      setAlert({ type: 'error', message: 'Device not found. Please connect the fingerprint scanner.' });
    }
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    setAlert(null);

    try {
      const result = await secuGenService.captureFingerprint();
      
      if (result.success) {
        setQualityScore(result.quality);
        
        // Set the image data - it should be a base64 string from the bridge
        if (result.imageData) {
          // Check if it already has data:image prefix
          const imageDataUrl = result.imageData.startsWith('data:') 
            ? result.imageData 
            : `data:image/bmp;base64,${result.imageData}`;
          setCapturedImage(imageDataUrl);
          console.log('Image data set:', imageDataUrl.substring(0, 100) + '...');
          console.log('Full image data length:', result.imageData.length);
        } else {
          console.warn('No image data received from capture');
        }
        
        onCapture({
          templateData: result.templateData,
          quality: result.quality,
          imageData: result.imageData
        });
      } else {
        setAlert({ type: 'error', message: result.message || 'Failed to capture fingerprint' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error capturing fingerprint: ' + error.message });
    } finally {
      setIsCapturing(false);
    }
  };

  const statusConfig = {
    ready: { color: 'bg-green-500', text: 'Device Ready', icon: '✓' },
    error: { color: 'bg-red-500', text: 'Device Not Found', icon: '✕' },
    checking: { color: 'bg-yellow-500', text: 'Checking Device...', icon: '⟳' },
  };

  const status = statusConfig[deviceStatus];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl shadow-soft border border-gray-100">
      <div className="text-center">
        <div className="mb-5">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-3 shadow-lg border-2 border-primary-200 overflow-hidden">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured fingerprint" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 text-primary-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                  <p className="text-xs text-gray-500">No capture</p>
                </div>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${status.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse`}>
              {status.icon}
            </div>
          </div>
          
          <div className="mt-3">
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
              <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}></div>
              <span className="text-xs font-medium text-gray-700">{status.text}</span>
            </div>
          </div>
        </div>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)}
          />
        )}

        {isCapturing ? (
          <div className="py-5">
            <LoadingSpinner size="md" message="Scanning..." />
          </div>
        ) : (
          <Button
            onClick={handleCapture}
            disabled={deviceStatus !== 'ready'}
            variant="primary"
            className="w-full py-2.5"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FingerprintCapture;
