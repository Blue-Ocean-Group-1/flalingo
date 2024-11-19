import mongoose from 'mongoose';

import Logger from '../config/logger.js';
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
  try {
    const decks = await Deck.find({ language: req.params.language });
    res.status(200).send(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getDecksByLanguageAndSkillLevelAndTheme = async (req, res) => {
  try {
    const decks = await Deck.find({ language: req.params.language, skillLevel: req.params.skillLevel, theme: req.params.theme });
    res.status(200).send(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteCardFromDeck =  () => {

}
// const deleteCardFromDeck = async (req, res) => {
//   try {
//     const { _id, word  } = req.params;

//     Logger.info('Delete card:', _id, word);
//     const objectId = new mongoose.Types.ObjectId(_id);
//     const flashcard = await Deck.findOneAndUpdate({ _id: objectId },
//       { $pull: { cards: { word: word } } },
//       { new: true }
//     );
//     res.status(200).json(flashcard);
//   }catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

export { getDecks, getDecksByLanguage, getDecksByLanguageAndSkillLevelAndTheme, deleteCardFromDeck };