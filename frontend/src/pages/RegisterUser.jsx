import React, { useState } from 'react';
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
  };

  const handleSubmit = async () => {
    if (!fingerprintData) {
      setAlert({ type: 'error', message: 'Please capture fingerprint first' });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      // Create user
      const userResponse = await userAPI.create(formData);
      const userId = userResponse.data.id;

      // Save fingerprint
      await fingerprintAPI.capture({
        user_id: userId,
        template_data: fingerprintData.templateData,
        quality_score: fingerprintData.quality
      });

      setAlert({ type: 'success', message: 'User registered successfully!' });
      
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.emp_id?.[0] || 
                          error.response?.data?.message || 
                          'Failed to register user';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Register New User
        </h1>

        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-primary-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">User Details</span>
            <span className="text-sm text-gray-600">Fingerprint</span>
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
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Employee: {formData.name}
              </h3>
              <p className="text-gray-600">ID: {formData.emp_id}</p>
            </div>

            <FingerprintCapture 
              onCapture={handleFingerprintCapture}
              buttonText="Capture Fingerprint"
            />

            <div className="mt-6 flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                variant="success" 
                onClick={handleSubmit}
                disabled={!fingerprintData || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
