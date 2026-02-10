import React, { useState, useEffect } from 'react';
import secuGenService from '../services/secugen';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const FingerprintCapture = ({ onCapture, buttonText = 'Capture Fingerprint' }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('checking');
  const [alert, setAlert] = useState(null);

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
        setAlert({ type: 'success', message: 'Fingerprint captured successfully!' });
        onCapture({
          templateData: result.templateData,
          quality: result.quality
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-primary-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                deviceStatus === 'ready' ? 'bg-green-500' :
                deviceStatus === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {deviceStatus === 'ready' ? 'Device Ready' :
                 deviceStatus === 'error' ? 'Device Not Found' :
                 'Checking Device...'}
              </span>
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
          <div className="py-8">
            <LoadingSpinner size="lg" message="Place your finger on the scanner..." />
          </div>
        ) : (
          <Button
            onClick={handleCapture}
            disabled={deviceStatus !== 'ready'}
            variant="primary"
            className="w-full"
          >
            {buttonText}
          </Button>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Place your finger firmly on the scanner when prompted
        </p>
      </div>
    </div>
  );
};

export default FingerprintCapture;
