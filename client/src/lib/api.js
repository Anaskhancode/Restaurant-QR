import axios from 'axios';
import { logout } from '../redux/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});
console.log('Axios interceptor file loaded');

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.name = 'anas';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          'http://localhost:3000/api/v1/auth/refresh',
          {
            refreshToken: localStorage.getItem('refreshToken'),
          }
        );

        localStorage.setItem('accessToken', res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest); // ✅ IMPORTANT
      } catch (err) {
        console.log('Refresh token failed', err);
        logout()
      }
    }

    return Promise.reject(error);
  }
);

export default api;

//1save it to local
// then call the api again