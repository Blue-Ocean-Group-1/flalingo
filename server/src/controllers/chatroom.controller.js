import { Chatroom } from '../models/chatroom.model.js';
import { Message } from '../models/message.model.js';

export const getChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find().lean();
    res.json(chatrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatroom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const chatroom = await Chatroom.findById(roomId).lean();
    res.json({ chatroom });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatroomMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chatroomId: req.params.roomId,
    })
      .lean()
      .sort('-timestamp')
      .limit(5);
    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
