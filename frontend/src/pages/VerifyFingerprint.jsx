import React, { useState } from 'react';
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

  const handleFingerprintCapture = async (data) => {
    setIsVerifying(true);
    setAlert(null);
    setVerificationResult(null);

    try {
      const response = await fingerprintAPI.verify({
        template_data: data.templateData
      });

      if (response.data.matched) {
        setVerificationResult({
          matched: true,
          user: response.data.user,
          confidence: response.data.confidence
        });
        setAlert({ 
          type: 'success', 
          message: `Welcome, ${response.data.user.name}!` 
        });
      } else {
        setVerificationResult({ matched: false });
        setAlert({ 
          type: 'error', 
          message: 'Fingerprint not recognized. Please try again.' 
        });
      }
    } catch (error) {
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
    setAlert(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Verify Fingerprint
        </h1>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)}
          />
        )}

        {!verificationResult && (
          <div>
            <p className="text-center text-gray-600 mb-6">
              Place your finger on the scanner to verify your identity
            </p>
            <FingerprintCapture 
              onCapture={handleFingerprintCapture}
              buttonText={isVerifying ? 'Verifying...' : 'Verify Fingerprint'}
            />
          </div>
        )}

        {verificationResult && verificationResult.matched && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Successful!
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {verificationResult.user.emp_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {verificationResult.user.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={handleReset}
                className="flex-1"
              >
                Verify Another
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {verificationResult && !verificationResult.matched && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              The fingerprint was not recognized in our system.
            </p>

            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={handleReset}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/register')}
                className="flex-1"
              >
                Register New User
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyFingerprint;
