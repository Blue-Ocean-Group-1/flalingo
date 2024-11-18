import mongoose from 'mongoose';

import logger from '../config/logger.js';
import { User } from '../models/user.model.js';

const helper = async (userId, language, deckName, attempt, skillLevel) => {
  try {
    const sanitizedUserId = mongoose.Types.ObjectId(userId);
    const sanitizedLanguage = mongoose.escape(language);
    const sanitizedDeckName = mongoose.escape(deckName);
    const sanitizedAttempt = mongoose.escape(attempt);
    const sanitizedSkillLevel = mongoose.escape(skillLevel);
    const user = await User.findOne({
      _id: sanitizedUserId,
      'progress.language': sanitizedLanguage,
      'progress.decks.deckName': sanitizedDeckName,
    });

    if (user) {
      await User.findOneAndUpdate(
        {
          _id: sanitizedUserId,
          'progress.language': sanitizedLanguage,
          'progress.decks.deckName': sanitizedDeckName,
        },
        {
          $push: {
            'progress.$.decks.$[deck].timesCompleted': sanitizedAttempt,
          },
        },
        {
          new: true,
          arrayFilters: [{ 'deck.deckName': sanitizedDeckName }], // This is for targeting the deck in the array
        },
      );
    } else {
      await User.findOneAndUpdate(
        {
          _id: userId,
          'progress.language': sanitizedLanguage,
        },
        {
          $push: {
            'progress.$.decks': {
              deckName: sanitizedDeckName,
              skillLevel: sanitizedSkillLevel,
              timesCompleted: [sanitizedAttempt],
            },
          },
        },
        { new: true },
      );
    }
  } catch (error) {
    logger.error('Error adding deck progress:', error);
  }
};

export default helper;
