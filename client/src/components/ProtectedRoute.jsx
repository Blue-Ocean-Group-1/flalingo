// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/authContext.js';
import Logger from '../../config/logger.js';

const ProtectedRoute = ({ children }) => {
<<<<<<< HEAD
  const { auth } = useContext(AuthContext);
  console.log('isAuthenticated', auth.isAuthenticated);
=======
  const { auth, authInitialized } = useContext(AuthContext);
  const location = useLocation();

  if (!authInitialized) {
    Logger.debug('ProtectedRoute: Auth initialization in progress...');
    return <div>Loading...</div>;
  }
>>>>>>> 2d34f7caa24961dcebebdd3f2666023078f5fb61

  if (!auth.isAuthenticated) {
    Logger.debug(
      'ProtectedRoute: User not authenticated, storing intended destination:',
      location.pathname,
    );
    sessionStorage.setItem('intendedDestination', location.pathname);
    return <Navigate to="/login" />;
  }

  Logger.debug(
    'ProtectedRoute: User authenticated, rendering protected content',
  );
  return children;
};

export default ProtectedRoute;
