import api from './api';

const register = async (userData) => {
  const response = await api.post('register/', userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('login/', credentials);
  return response.data; // expected to return token and user info
};

const authService = {
  register,
  login,
};

export default authService;
