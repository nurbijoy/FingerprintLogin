import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto page-transition">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fingerprint Authentication
        </h1>
        <p className="text-gray-600">
          Secure biometric identity verification
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div
          className="group bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-200 transform hover:-translate-y-1"
          onClick={() => navigate('/register')}
        >
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-4 shadow-md group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Register User
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enroll new employee fingerprint
            </p>
            <Button variant="primary" className="w-full py-2">
              Register
            </Button>
          </div>
        </div>

        <div
          className="group bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 transform hover:-translate-y-1"
          onClick={() => navigate('/verify')}
        >
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 shadow-md group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Verify Identity
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Authenticate with fingerprint
            </p>
            <Button variant="success" className="w-full py-2">
              Verify
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/users')}
          className="py-2"
        >
          Manage Users
        </Button>
      </div>
    </div>
  );
};

export default Home;
