import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@formerbench/shared';

// Load base API URL dynamically from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    '⚠️ [API Client] VITE_API_BASE_URL is not set! Ensure .env or environment configuration is provided.'
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token if present in localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('formerbench_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract response data and handle common errors (e.g. 401 unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    if (status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem('formerbench_auth_token');
      localStorage.removeItem('formerbench_auth_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(new Error(message));
  }
);
