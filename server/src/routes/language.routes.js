import express from 'express';

import {
  getLanguages,
  getLanguageNames,
} from '../controllers/language.controller.js';

const languageRouter = express.Router();

languageRouter.get('/', getLanguages);

languageRouter.get('/names', getLanguageNames);

export default languageRouter;
