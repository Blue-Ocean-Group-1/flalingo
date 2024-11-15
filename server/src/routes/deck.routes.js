import express from 'express';

import { getDecks } from '../controllers/deck.controller.js';

const deckRouter = express.Router();

deckRouter.get('/', getDecks);

export default deckRouter;
