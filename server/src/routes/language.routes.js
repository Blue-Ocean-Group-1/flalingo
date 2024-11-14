import express from 'express';

import { getLanguages } from '../controllers/language.controller.js';

const languageRouter = express.Router();

languageRouter.get('/', getLanguages);

export default languageRouter;
