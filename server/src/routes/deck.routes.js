import express from 'express';

import { getDecks, getDecksByLanguage } from '../controllers/deck.controller.js';

const deckRouter = express.Router();

deckRouter.get('/', getDecks);

deckRouter.get('/:language', getDecksByLanguage);


export default deckRouter;
