import { Chatroom } from '../models/chatroom.model.js';

export const getChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find();
    res.json(chatrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
