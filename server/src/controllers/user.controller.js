import Logger from '../config/logger.js';
import progressHelper from '../helpers/addDeckProgress.js';
import { getRandomDailyWords } from '../helpers/randomDailyWords.js';
import { User } from '../models/user.model.js';

export const getUsers = async (req, res) => {
  try {
    Logger.info('user.controller.js: Fetching all users');
    const users = await User.find();
    Logger.info('user.controller.js: Successfully fetched all users');
    res.json({ message: 'Users fetched successfully', users });
  } catch (error) {
    Logger.error(`user.controller.js: Error fetching users - ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserData = async (req, res) => {
  try {
    Logger.info(`user.controller.js: Fetching data for user ${req.user.id}`);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      Logger.info(`user.controller.js: User ${req.user.id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    Logger.info(
      `user.controller.js: Successfully fetched data for user ${req.user.id}`,
    );
    res.json(user);
  } catch (error) {
    Logger.error(
      `user.controller.js: Error fetching user data - ${error.message}`,
    );
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyWords = async (req, res) => {
  try {
    const dailyWords = await getRandomDailyWords(req.params.id);
    res.status(200).send(dailyWords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDeckProgress = async (req, res) => {
  try {
    await progressHelper(
      req.body.userId,
      req.body.language,
      req.body.deckName,
      req.body.attempt,
    );
    res.status(200).send('Successfully added timesCompleted');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateUserData = async (req, res) => {
  try {
    Logger.info(`user.controller.js: Updating data for user ${req.user.id}`);

    const protectedFields = ['password', '_id', 'username'];
    let updateData = {};

    if (req.body.demographics) {
      const validDemographicFields = ['age', 'gender', 'country', 'zipcode'];
      const invalidDemographicFields = Object.keys(
        req.body.demographics,
      ).filter((field) => !validDemographicFields.includes(field));

      if (invalidDemographicFields.length > 0) {
        return res.status(400).json({
          message: 'Invalid demographic fields',
          invalidFields: invalidDemographicFields,
        });
      }

      const currentUser = await User.findById(req.user.id);

      updateData.demographics = {
        ...currentUser.demographics.toObject(),
        ...req.body.demographics,
      };
    }

    Object.keys(req.body).forEach((key) => {
      if (!protectedFields.includes(key) && key !== 'demographics') {
        updateData[key] = req.body[key];
      }
    });

    if (updateData.email && updateData.email !== req.user.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: 'Email already in use',
          field: 'email',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: '-password',
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    Logger.info(
      `user.controller.js: Successfully updated data for user ${req.user.id}`,
    );
    res.json(updatedUser);
  } catch (error) {
    Logger.error(
      `user.controller.js: Error updating user data - ${error.message}`,
    );

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({ message: 'Server error', error });
  }
};
