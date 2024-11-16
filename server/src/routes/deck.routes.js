import express from 'express';
import RateLimit from 'express-rate-limit';

import {
  getDecks,
  getDecksByLanguage,
} from '../controllers/deck.controller.js';

const deckRouter = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

deckRouter.get('/', getDecks);

deckRouter.get('/:language', limiter, getDecksByLanguage);

export default deckRouter;
