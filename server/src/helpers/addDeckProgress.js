 import logger from '../config/logger';

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
      },
    );

  } catch {
    logger.error('Error adding deck progress');
  }
}

export default helper;