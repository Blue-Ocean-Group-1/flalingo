import mongoose from 'mongoose';

import logger from '../config/logger.js';
import { User } from '../models/user.model.js';

const helper = async (userId, language, deckName, attempt) => {
  try {
    // Sanitize inputs for to make CodeQL happy 👶🏻
    const sanitizedUserId = mongoose.Types.ObjectId(userId);
    const sanitizedLanguage = mongoose.escape(language);
    const sanitizedDeckName = mongoose.escape(deckName);
    const sanitizedAttempt = mongoose.escape(attempt);

    // Find the user by their ID and update their progress
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
        new: true, // Return the updated document
        arrayFilters: [{ 'deck.deckName': sanitizedDeckName }], // This is for targeting the deck in the array
      },
    );
  } catch (error) {
    logger.error('Error adding deck progress', error);
  }
};

export default helper;
