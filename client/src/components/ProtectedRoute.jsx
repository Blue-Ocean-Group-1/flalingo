// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log('isAuthenticated', auth.isAuthenticated);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
