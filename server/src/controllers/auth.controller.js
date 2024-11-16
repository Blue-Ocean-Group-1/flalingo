import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.model.js';

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  try {
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      currentLoginStreak: 0,
      longestLoginStreak: 0,
      timeUsingApp: 0,
      gems: 0,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'No such user found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
};
