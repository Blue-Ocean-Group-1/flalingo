import { Message } from '../models/message.model.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessagesByRoomId = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const createMessage = async (req, res) => {
//   try {
//     const message = new Message(req.body);
//     await message.save();
//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
