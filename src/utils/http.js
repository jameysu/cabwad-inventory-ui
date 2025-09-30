
import axios from 'axios';

// Create the Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use env var or fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
const http = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default http;
