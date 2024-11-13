import express from 'express';

import { getMessages } from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.get('/', getMessages);

export default messageRouter;
