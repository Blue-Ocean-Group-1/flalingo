import { Chatroom } from '../models/chatroom.model.js';

export const getChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find();
    res.json(chatrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatroom = async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.roomId);
    res.json(chatroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
