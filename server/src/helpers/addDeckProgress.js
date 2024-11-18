<<<<<<< HEAD
// import logger from '../config/logger';

const helper = async (userId, language, deckName, attempt) => {
  try {
    // Find the user by their ID and update their progress
    const user = await User.findOneAndUpdate(
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
        new: true, // Return the updated document
        arrayFilters: [{ 'deck.deckName': deckName }], // This is for targeting the deck in the array
      }
    );
  } catch {
    logger.error('Error adding deck progress');
=======
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
        },
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
        { new: true },
      );
    }
  } catch (error) {
    logger.error('Error adding deck progress:', error);
>>>>>>> 0f4a8e549d7e3166c7acae2d66fe180488de79c3
  }
};

export default helper;
