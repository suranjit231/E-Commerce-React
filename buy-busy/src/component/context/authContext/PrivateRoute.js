import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
