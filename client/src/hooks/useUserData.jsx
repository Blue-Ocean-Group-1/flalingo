import { useState, useEffect } from 'react';
import { fetchUserData, updateUserData } from '../services/user.api.js';
import useAuth from './useAuth.jsx';
import Logger from '../../config/logger.js';

const useUserData = () => {
  Logger.info('useUserData: Initializing');
  const { token, isAuthenticated, authInitialized } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    const getUserData = async () => {
      Logger.info('useUserData: Fetching user data');
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await fetchUserData(token);
        setUserData(data);
        setError(null);
        Logger.info('useUserData: User data fetched');
      } catch (err) {
        setError('Failed to fetch user data');
        Logger.error('useUserData: Failed to fetch user data', err);
        Logger.debug('useUserData: token:', token);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [token, authInitialized]);

  return [userData, loading, error, isAuthenticated];
};

export default useUserData;
