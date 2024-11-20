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

export const updateParticipantCount = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    await Chatroom.findByIdAndUpdate(
      { _id: roomId, balance: { $gte: 1 } },
      { $inc: { participantCount: req.body.eventType === 'join' ? 1 : -1 } },
    );
    return res.sendStatus(200);
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
      .limit(100);
    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createChatroomMessage = async (req, res) => {
  try {
    const { senderId, senderName, language, content } = req.body;
    const chatroomId = req.params.roomId;
    const newMessage = new Message({
      senderId,
      senderName,
      content,
      language,
      chatroomId,
    });
    await newMessage.save();
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
