import express from 'express';

import { getFlashcards } from '../controllers/flashcard.controller.js';

const flashcardRouter = express.Router();

flashcardRouter.get('/', getFlashcards);


export default flashcardRouter;
