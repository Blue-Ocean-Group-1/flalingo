import api from './index.js';
import Logger from '../../config/logger.js';

const getChatrooms = async () => {
  try {
    // Logger.info('Attempting to get all chatrooms');
    const response = await api.get('/chatrooms');
    // Logger.info('Successfully retrieved all chatrooms');
    return response.data;
  } catch (error) {
    Logger.error('Failed to get all chatrooms', error);
    throw error;
  }
};

// eventType is either 'join' or 'leave'
const updateChatroomParticipantCount = async (roomId, eventType) => {
  try {
    const response = await api.patch(`/chatrooms/${roomId}/participantCount`, {
      eventType: eventType,
    });
    return response.data;
  } catch (error) {
    Logger.error('Failed to update chatroom participant count', error);
    throw error;
  }
};

const getChatroom = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}`);
  return response.data;
};

const getChatroomMessages = async (roomId) => {
  const response = await api.get(`/chatrooms/${roomId}/messages`);
  return response.data;
};

const createChatMessage = async ({
  userId,
  username,
  roomId,
  language,
  content,
}) => {
  const response = await api.post(`/chatrooms/${roomId}/messages`, {
    senderId: userId,
    senderName: username,
    roomId,
    language,
    content,
  });
  return response.data;
};
export {
  getChatrooms,
  getChatroom,
  getChatroomMessages,
  createChatMessage,
  updateChatroomParticipantCount,
};
