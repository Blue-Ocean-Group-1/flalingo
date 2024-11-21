import express from 'express';

import { sendEmail } from '../controllers/email.controller.js';

const emailRouter = express.Router();

emailRouter.post('/', sendEmail);

export default emailRouter;
