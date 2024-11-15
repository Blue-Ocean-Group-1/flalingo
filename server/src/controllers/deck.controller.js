import { Deck } from '../models/deck.model.js';

const getDecks = async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDecksByLanguage = async (req, res) => {
  console.log(req.params.language);
  try {
    const decks = await Deck.find({ language: req.params.language });
    res.status(200).send(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { getDecks, getDecksByLanguage };