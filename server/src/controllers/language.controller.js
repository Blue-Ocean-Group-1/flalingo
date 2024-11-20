import { Language } from '../models/language.model.js';

export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLanguageNames = async (req, res) => {
  try {
    const languages = await Language.find();
    const languageNames = languages.map((language) => language.name);
    res.json(languageNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
