import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getCsrfToken } from '@/utils/csrf';
import { useNavigate } from 'react-router-dom';

interface Profile {
  layout_preference: 'top' | 'side';
  theme_color: string;
  theme_mode: 'light' | 'dark';
  allowed_pages: string[];
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  profile: Profile;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setUser: (user: User) => void;
  hasPagePermission: (pagePath: string) => boolean;
  updateProfile: (profileData: Partial<Profile>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';

    axios.interceptors.request.use(
      (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('/api/auth/verify/');
        console.log('Session verification response:', response.data);
        setAuthState({
          isAuthenticated: response.data.isAuthenticated,
          user: response.data.user,
        });
      } catch (error) {
        console.error('Session verification failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login/', {
        username,
        password,
      });

      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
      });

      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout/');
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const hasPagePermission = (pagePath: string) => {
    // Public pages that don't require authentication
    const publicPages = ['/login', '/register', '/forgot-password'];
    if (publicPages.includes(pagePath)) {
      return true;
    }

    // Must be authenticated beyond this point
    if (!authState.user) {
      return false;
    }

    // Must have a valid profile and allowed_pages array
    if (!authState.user.profile?.allowed_pages || !Array.isArray(authState.user.profile.allowed_pages)) {
      return false;
    }

    // Check if user has access to this page
    return authState.user.profile.allowed_pages.includes(pagePath);
  };

  const setUser = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
    }));
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const response = await axios.patch('/api/auth/profile/', profileData);
      setAuthState(prev => ({
        ...prev,
        user: response.data.user
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        loading,
        setUser,
        hasPagePermission,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
