import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';
import { useNavigate } from 'react-router';

const ProtectedComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default ProtectedComponent;
