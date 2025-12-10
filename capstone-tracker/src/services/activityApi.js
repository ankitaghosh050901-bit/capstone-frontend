// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // adjust if your backend is hosted elsewhere
});

// Automatically attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // or `Bearer ${token}` if your backend expects Bearer
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
