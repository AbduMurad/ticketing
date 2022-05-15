import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  NotFoundError,
  errorHandler,
  currentUserSetter,
} from '@am-gittix/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketsRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketsRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// Post-routing middlewares
app.use(errorHandler);

export { app };
