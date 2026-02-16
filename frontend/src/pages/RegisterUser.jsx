import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import FingerprintCapture from '../components/FingerprintCapture';
import { userAPI, fingerprintAPI } from '../services/api';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emp_id: '',
    name: '',
  });
  const [fingerprintData, setFingerprintData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [qualityScore, setQualityScore] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.emp_id || !formData.name) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    setStep(2);
    setAlert(null);
  };

  const handleFingerprintCapture = (data) => {
    setFingerprintData(data);
    setQualityScore(data.quality);
  };

  const handleSubmit = async () => {
    if (!fingerprintData) {
      setAlert({ type: 'error', message: 'Please capture fingerprint first' });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);
    let createdUserId = null;

    try {
      const userResponse = await userAPI.create(formData);
      createdUserId = userResponse.data.id;

      const fingerprintPayload = {
        user_id: createdUserId,
        template_data: fingerprintData.templateData,
        quality_score: fingerprintData.quality || 0
      };
      
      if (!fingerprintPayload.user_id) {
        throw new Error('user_id is missing from payload');
      }
      
      await fingerprintAPI.capture(fingerprintPayload);

      setAlert({ type: 'success', message: 'User registered successfully!' });
      
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error) {
      if (createdUserId && error.response?.config?.url?.includes('fingerprint')) {
        try {
          await userAPI.delete(createdUserId);
        } catch (rollbackError) {
          console.error('Failed to rollback user creation:', rollbackError);
        }
      }
      
      const errorMessage = error.response?.data?.details?.user_id?.[0] ||
                          error.response?.data?.error ||
                          error.response?.data?.message || 
                          error.message ||
                          'Failed to register user';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 page-transition">
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            Register New User
          </h1>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
              step >= 1 ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 rounded-full transition-all ${
              step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
              step >= 2 ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'
            }`}>
              2
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

        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Employee ID"
                  name="emp_id"
                  value={formData.emp_id}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                  required
                />
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Registration Steps
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 font-bold">1.</span>
                    <span>Enter employee details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 font-bold">2.</span>
                    <span>Capture fingerprint biometric</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 font-bold">3.</span>
                    <span>Complete registration process</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="flex-1 py-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 py-2">
                Next Step
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div>
            <div className="grid md:grid-cols-2 gap-5 items-start">
              <div>
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-3 mb-4 border border-primary-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {formData.name}
                      </h3>
                      <p className="text-xs text-gray-600">ID: {formData.emp_id}</p>
                    </div>
                  </div>
                </div>
                <FingerprintCapture 
                  onCapture={handleFingerprintCapture}
                  buttonText="Capture Fingerprint"
                />
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Capture Tips
                </h3>
                
                {qualityScore !== null && (
                  <div className="mb-3 p-3 bg-white rounded-lg border-2 border-primary-200">
                    <p className="text-xs text-gray-600 mb-1">Quality Score</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${
                        qualityScore >= 80 ? 'text-green-600' : 
                        qualityScore >= 60 ? 'text-blue-600' : 
                        qualityScore >= 40 ? 'text-yellow-600' : 'text-orange-600'
                      }`}>
                        {qualityScore}/100
                      </span>
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${
                        qualityScore >= 80 ? 'bg-green-100 text-green-700' : 
                        qualityScore >= 60 ? 'bg-blue-100 text-blue-700' : 
                        qualityScore >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {qualityScore >= 80 ? 'Excellent' : 
                         qualityScore >= 60 ? 'Good' : 
                         qualityScore >= 40 ? 'Fair' : 'Marginal'}
                      </span>
                    </div>
                  </div>
                )}
                
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Ensure finger is clean and dry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Center finger on scanner surface</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Press firmly and keep still</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Wait for LED indicator</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Quality score should be above 60</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex-1 py-2"
              >
                Back
              </Button>
              <Button 
                variant="success" 
                onClick={handleSubmit}
                disabled={!fingerprintData || isSubmitting}
                className="flex-1 py-2"
              >
                {isSubmitting ? 'Registering...' : 'Complete'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
