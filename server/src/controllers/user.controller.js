import progressHelper from '../helpers/addDeckProgress.js';
import { generateUserReport } from '../helpers/generateUserReport.js';
import { getRandomDailyWords } from '../helpers/randomDailyWords.js';
import { User } from '../models/user.model.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
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

export const updateUserData = async (req, res) => {
  try {
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

    // First update the user
    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      {
        runValidators: true,
      },
    );

    // Then fetch the complete user object
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .lean();

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({ message: 'Server error', error });
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
};

export const initDailyProgress = async (req, res) => {
  try {
    const exists = await User.exists({
      _id: req.params.id,
      'dailyGoalProgress.date': {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (exists) throw new Error('Daily progress already initialized');
    const progress = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          dailyGoalProgress: {
            completed: false,
            loggedIn: true,
            deckCompleted: false,
            conversationRoomJoined: false,
          },
        },
      },
      { new: true },
    );

    res.status(200).json(progress);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const updateDailyProgress = async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        'dailyGoalProgress.date': {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      },
      {
        $set: {
          'dailyGoalProgress.$': {
            ...req.body,
          },
        },
      },
      { new: true },
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const getDailyProgress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const dailyProgress = getDailyProgress(user);
    res.status(200).send(dailyProgress);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const addNewLanguageProgress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.activeLanguages = [req.body.language];
    user.allLanguages.push(req.body.language);
    const languageProgress = {
      language: req.body.language,
      skillLevel: 'beginner',
      decks: [],
    };
    user.progress.push(languageProgress);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
