import api from './index.js';
import Logger from '../../config/logger.js';

export const fetchUserData = async (token) => {
  try {
    Logger.info('user.api.js: Fetching user data');
    const response = await api.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Logger.info('user.api.js: User data fetched successfully');
    return response.data;
  } catch (error) {
    Logger.error(`user.api.js: Error fetching user data - ${error.message}`);
    throw error;
  }
};

export const updateUserData = async (token, updatedData) => {
  try {
    Logger.info('user.api.js: Updating user data');
    const response = await api.put(`/users/me`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Logger.info('user.api.js: User data updated successfully');
    return response.data;
  } catch (error) {
    Logger.error(`user.api.js: Error updating user data - ${error.message}`);
    throw error;
  }
};

export const initializeDailyProgress = async (userId) => {
  try {
    const result = await api.put(`/users/${userId}/dailyProgress`);
    return result;
  } catch (error) {
    Logger.error(
      `Error occurred initializing daily progress - ${error.message}`,
    );
    throw error;
  }
};

export const updateDailyProgress = async (userId, updatedData) => {
  try {
    const result = await api.patch(
      `/users/${userId}/dailyProgress`,
      updatedData,
    );
    return result;
  } catch (error) {
    Logger.error(`Error occurred updating daily progress - ${error.message}`);
    throw error;
  }
};
