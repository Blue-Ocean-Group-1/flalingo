import logger from '../config/logger.js';
import { User } from '../models/user.model.js';

const helper = async (userId, language, deckName, attempt, skillLevel) => {
  try {
    const sanitizedUserId = userId.replace(/[^\w\s]/gi, '');
    const sanitizedLanguage = language.replace(/[^\w\s]/gi, '');
    const sanitizedDeckName = deckName.replace(/[^\w\s]/gi, '');
    const sanitizedAttempt = { ...attempt };
    const sanitizedSkillLevel = skillLevel;
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
          // This is for targeting the deck in the array in case anyone's wondering
          arrayFilters: [{ 'deck.deckName': sanitizedDeckName }],
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
