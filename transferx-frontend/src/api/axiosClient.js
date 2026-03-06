import axios from 'axios';

const axiosClient = axios.create({
  // Use VITE_API_BASE_URL when defined (via .env file) otherwise fall back to
  // the common public URL or a sensible default.  During development the
  // backend usually listens on port 3001, so default there to avoid the
  // "Failed to load dashboard data" network errors when the variable is
  // missing.
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_PUBLIC_API_URL ||
    'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('transferx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// On 401: clear storage and redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('transferx_token');
      localStorage.removeItem('transferx_role');
      localStorage.removeItem('transferx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
