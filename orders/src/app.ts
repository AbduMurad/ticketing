import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  NotFoundError,
  errorHandler,
  currentUserSetter,
} from '@am-gittix/common';

import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);

// Pre-routing middlewares
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUserSetter);

// Routes
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// Post-routing middlewares
app.use(errorHandler);

export { app };
