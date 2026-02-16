import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { userAPI } from '../services/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Failed to load users: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await userAPI.delete(userId);
      setAlert({ type: 'success', message: 'User deleted successfully' });
      fetchUsers();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Failed to delete user: ' + error.message 
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" message="Loading users..." />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 page-transition">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            User Management
          </h1>
          <Button 
            variant="primary" 
            onClick={() => navigate('/register')}
            className="py-2"
          >
            + Add User
          </Button>
        </div>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)}
          />
        )}

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first user'}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => navigate('/register')}>
                + Add User
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-white rounded-xl shadow-soft hover:shadow-lg transition-all p-6 border border-gray-100 card-hover"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user.emp_id}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fingerprints</span>
                    <span className="font-semibold text-gray-900 bg-white px-2 py-0.5 rounded">
                      {user.fingerprint_count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Registered</span>
                    <span className="text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(user.id, user.name)}
                  className="w-full text-sm py-2"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => navigate('/')} className="py-2">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
