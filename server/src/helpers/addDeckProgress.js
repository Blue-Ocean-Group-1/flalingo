import logger from '../config/logger.js';
import { User } from '../models/user.model.js';

const helper = async (userId, language, deckName, attempt, skillLevel) => {
  try {
    const user = await User.findOne({
      _id: userId,
      'progress.language': language,
      'progress.decks.deckName': deckName,
    });

    if (user) {
      await User.findOneAndUpdate(
        {
          _id: userId,
          'progress.language': language,
          'progress.decks.deckName': deckName,
        },
        {
          $push: {
            'progress.$.decks.$[deck].timesCompleted': attempt,
          },
        },
        {
          new: true,
          arrayFilters: [{ 'deck.deckName': deckName }],
        }
      );
    } else {
      await User.findOneAndUpdate(
        {
          _id: userId,
          'progress.language': language,
        },
        {
          $push: {
            'progress.$.decks': {
              deckName: deckName,
              skillLevel: skillLevel,
              timesCompleted: [attempt],
            },
          },
        },
        { new: true }
      );
    }
  } catch (error) {
    logger.error('Error adding deck progress:', error);
  }
};

export default helper;
