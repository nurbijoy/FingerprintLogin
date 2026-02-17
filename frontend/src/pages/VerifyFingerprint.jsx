import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Alert from '../components/Alert';
import FingerprintCapture from '../components/FingerprintCapture';
import { fingerprintAPI } from '../services/api';

const VerifyFingerprint = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);

  const handleFingerprintCapture = async (data) => {
    setIsVerifying(true);
    setVerificationResult(null);
    setAlert(null);
    setVerifyProgress(0);

    // Simulate progress while verifying
    const progressInterval = setInterval(() => {
      setVerifyProgress(prev => {
        if (prev >= 90) return prev; // Stop at 90% until actual completion
        return prev + 10;
      });
    }, 150); // Update every 150ms

    try {
      const response = await fingerprintAPI.verify({
        template_data: data.templateData
      });

      clearInterval(progressInterval);
      setVerifyProgress(100);
      
      // Brief pause to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 300));

      if (response.data.matched) {
        setVerificationResult({
          matched: true,
          user: response.data.user,
          confidence: response.data.confidence
        });
      } else {
        setVerificationResult({ matched: false });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setVerifyProgress(0);
      setAlert({ 
        type: 'error', 
        message: 'Verification failed: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setVerificationResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 page-transition">
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Verify Identity
        </h1>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)}
          />
        )}

        {!verificationResult && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <p className="text-gray-600 mb-4">
                Place your finger on the scanner to authenticate
              </p>
              
              {isVerifying && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Matching fingerprint...</p>
                      <p className="text-xs text-gray-600">Comparing against database</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{verifyProgress}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${verifyProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <FingerprintCapture 
                onCapture={handleFingerprintCapture}
                buttonText={isVerifying ? 'Verifying...' : 'Scan Fingerprint'}
                disabled={isVerifying}
              />
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Quick Guide
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 font-bold">1.</span>
                  <span>Ensure device is connected and ready</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 font-bold">2.</span>
                  <span>Place finger firmly on scanner</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 font-bold">3.</span>
                  <span>Wait for verification result</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 font-bold">4.</span>
                  <span>Access granted if fingerprint matches</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {verificationResult && verificationResult.matched && (
          <div className="text-center py-4 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Verified Successfully!
            </h2>
            <p className="text-sm text-gray-600 mb-4">Identity confirmed</p>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Employee ID</p>
                  <p className="text-base font-bold text-gray-900">
                    {verificationResult.user.emp_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                  <p className="text-base font-bold text-gray-900">
                    {verificationResult.user.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <Button 
                variant="secondary" 
                onClick={handleReset}
                className="flex-1 py-2"
              >
                Verify Another
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="flex-1 py-2"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {verificationResult && !verificationResult.matched && (
          <div className="text-center py-4 animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Fingerprint not found in system
            </p>

            <div className="flex gap-3 max-w-md mx-auto">
              <Button 
                variant="secondary" 
                onClick={handleReset}
                className="flex-1 py-2"
              >
                Try Again
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/register')}
                className="flex-1 py-2"
              >
                Register
              </Button>
            </div>
          </div>
        )}

        {!verificationResult && (
          <div className="mt-4 text-center">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
              className="py-2"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyFingerprint;
