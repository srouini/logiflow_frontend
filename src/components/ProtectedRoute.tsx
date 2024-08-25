import React from 'react';
import useAuth from '../hooks/useAuth';
import Loader from './Loader';
import { useNavigate } from 'react-router';


const ProtectedComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    navigate('/login');;
  }

  // Render the children when authenticated
  return <>{children}</>;
};

export default ProtectedComponent;