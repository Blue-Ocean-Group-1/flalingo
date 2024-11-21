import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserData, updateUserData } from '../services/user.api.js';
import useAuth from './useAuth.jsx';
import Logger from '../../config/logger.js';

// Create a Context for userData
const UserDataContext = createContext();

// UserDataProvider to wrap the app and provide user data
export const UserDataProvider = ({ children }) => {
  Logger.info('UserDataProvider: Initializing');
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDeck, setActiveDeck] = useState(null);

  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    const getUserData = async () => {
      Logger.info('UserDataProvider: Fetching user data');
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await fetchUserData(token);
        setUserData(data);
        setError(null);
        Logger.info('UserDataProvider: User data fetched');
      } catch (err) {
        setError('Failed to fetch user data');
        Logger.error('UserDataProvider: Failed to fetch user data', err);
        Logger.debug('UserDataProvider: token:', token);
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
    Logger.info('UserDataProvider: Updating user data');

    const previousData = userData;

    try {
      setUserData((current) => ({
        ...current,
        ...updatedData,
      }));

      const updatedUser = await updateUserData(token, updatedData);
      setUserData({ ...userData, ...updatedUser });
      setError(null);
      Logger.info('UserDataProvider: User data updated');
      Logger.debug('UserDataProvider: updatedUser:', updatedUser);

      return updatedUser;
    } catch (err) {
      setUserData(previousData);
      setError('Failed to update');
      Logger.error('UserDataProvider: Failed to update user data', err);
      Logger.debug('UserDataProvider: updatedData:', updatedData);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        error,
        updateUser,
        activeDeck,
        setActiveDeck,
        setUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook to use userData context
export const useUserData = () => {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }

  return context;
};
