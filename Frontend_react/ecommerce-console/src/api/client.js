import axios from 'axios';

// Default base URL is empty string so it uses the current origin (localhost:5173)
// This allows the Vite proxy to intercept request
const api = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Check for custom base URL overrides if needed, 
    // but default to proxy for dev environment
    const storedBaseUrl = localStorage.getItem('baseUrl');
    if (storedBaseUrl && storedBaseUrl !== 'http://localhost:8080') {
        config.baseURL = storedBaseUrl;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
