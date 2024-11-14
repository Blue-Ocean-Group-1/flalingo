import { User } from '../models/user.model.js';

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { getUsers, getUserById };
