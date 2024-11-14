import { Deck } from '../models/deck.model.js';

export const getDecks = async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
