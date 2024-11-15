import express from 'express';

import { getDecks, getDecksByLanguage } from '../controllers/deck.controller.js';

const deckRouter = express.Router();

deckRouter.get('/', getDecks);

<<<<<<< HEAD
deckRouter.get('/:language', getDecksByLanguage);

=======
>>>>>>> 7207c689157405dcd74c3ee70f6432b1a4bc1e3e
export default deckRouter;
