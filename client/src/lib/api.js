import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor injects token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('disuruhsuruh_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor handles response error gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage = error.response?.data?.message || error.message || 'Terjadi gangguan jaringan';
    return Promise.reject(new Error(customMessage));
  }
);

export default api;
