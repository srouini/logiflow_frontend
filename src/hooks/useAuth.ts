import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '@/utils/constants';

interface UseAuth {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const useAuth = (): UseAuth => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: API_ENDPOINT, // Your backend API base URL
    withCredentials: true,  // Ensure cookies are sent with requests
  });

  useEffect(() => {
    // Check authentication status on mount
    checkAuthentication();
  }, []);

  // Function to handle login
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/auth/get/token/`,
        { username, password },
        {withCredentials:true}
     // Send cookies with the request
      );

      if (response.status === 200) {
        
        setIsAuthenticated(true);
        navigate('/'); // Redirect to dashboard after login
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(
        '/api/auth/logout/',
        {},
        { withCredentials: true } // Ensure cookies are sent with the request
      );

      setIsAuthenticated(false);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    setLoading(true);
  
    try {
      // Initial check for authentication
      const response = await axiosInstance.get('/api/auth/check/', {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
      } 
    } catch (error) {
      // If initial check fails, try to refresh the token
      try {
        const refreshResponse = await axiosInstance.post('/api/auth/token/refresh', {
          withCredentials: true, // Ensure cookies are sent with the request
        });
  
        if (refreshResponse.status === 200) {
          // Token refresh successful, retry authentication check
          const response = await axiosInstance.get('/api/auth/check/', {
            withCredentials: true,
          });
  
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (refreshError) {
        // If refresh token fails, log out the user
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, login, logout, loading };
};

export default useAuth;
