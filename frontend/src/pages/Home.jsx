import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fingerprint Authentication System
        </h1>
        <p className="text-xl text-gray-600">
          Secure and fast biometric authentication
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500"
          onClick={() => navigate('/register')}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Register New User
            </h2>
            <p className="text-gray-600 mb-6">
              Add a new employee with fingerprint enrollment
            </p>
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </div>
        </div>

        <div 
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500"
          onClick={() => navigate('/verify')}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Fingerprint
            </h2>
            <p className="text-gray-600 mb-6">
              Authenticate using registered fingerprint
            </p>
            <Button variant="success" className="w-full">
              Verify Now
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/users')}
        >
          View All Users
        </Button>
      </div>
    </div>
  );
};

export default Home;
