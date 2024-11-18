// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { fetchUserData, updateUserData } from '../services/user.api.js';
import useAuth from './useAuth.jsx';
import Logger from '../../config/logger.js';

const useUserData = () => {
  Logger.info('useUserData: Initializing');
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      Logger.info('useUserData: Fetching user data');
      try {
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

    if (token) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const updateUser = async (updatedData) => {
    Logger.info('useUserData: Updating user data');
    try {
      const updatedUser = await updateUserData(token, updatedData);
      setUserData(updatedUser);
      setError(null);
      Logger.info('useUserData: User data updated');
      Logger.debug('useUserData: updatedUser:', updatedUser);
    } catch (err) {
      setError('Failed to update');
      Logger.error('useUserData: Failed to update user data', err);
      Logger.debug('useUserData: updatedData:', updatedData);
    }
  };

  return [userData, loading, error, updateUser];
};

export default useUserData;
