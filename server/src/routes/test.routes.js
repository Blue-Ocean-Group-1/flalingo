import express from 'express';

import {
  healthCheck,
  clientError,
  serverError,
} from '../controllers/test.controller.js';

const testRouter = express.Router();

testRouter.get('/health', healthCheck);

testRouter.get('/error/client', clientError);

testRouter.get('/error/server', serverError);

export default testRouter;
