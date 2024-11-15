import express from 'express';

import { getChatrooms } from '../controllers/chatroom.controller.js';

const chatroomsRouter = express.Router();

chatroomsRouter.get('/', getChatrooms);

export default chatroomsRouter;
