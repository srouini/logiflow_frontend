import { useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';

export const useAxios = (): AxiosInstance => {
  const navigate = useNavigate();

  // Create an axios instance
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Your backend API base URL
    withCredentials: true,  // Ensure cookies are sent with requests
  });

  useEffect(() => {
    // Response Interceptor to handle errors and token expiration
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token is expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token (the refresh token is also in HttpOnly cookie)
            await axiosInstance.post('/api/auth/token/refresh');
            
            // Retry the original request after the token is refreshed
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            navigate('/login'); // Redirect to login
          }
        }

        return Promise.reject(error);
      }
    );
  }, [axiosInstance, navigate]);

  return axiosInstance;
};
