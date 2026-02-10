import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  create: (userData) => api.post('/users/', userData),
  delete: (id) => api.delete(`/users/${id}/`),
  search: (empId) => api.get(`/users/search/?emp_id=${empId}`),
};

// Fingerprint API
export const fingerprintAPI = {
  capture: (data) => api.post('/fingerprints/capture/', data),
  verify: (data) => api.post('/fingerprints/verify/', data),
  getUserFingerprints: (userId) => api.get(`/fingerprints/user/${userId}/`),
  delete: (id) => api.delete(`/fingerprints/${id}/`),
};

export default api;
