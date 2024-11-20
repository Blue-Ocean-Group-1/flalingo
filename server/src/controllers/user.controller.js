import Logger from '../config/logger.js';
import progressHelper from '../helpers/addDeckProgress.js';
import { generateUserReport } from '../helpers/generateUserReport.js';
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
      req.body.skillLevel,
    );
    res.status(200).send('Successfully added timesCompleted');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getUserReportById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    let report = generateUserReport(user);
    res.status(200).send(report);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}