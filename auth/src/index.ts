import 'express-async-errors';
import mongoose from 'mongoose';

import { app } from './app';

const startServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Can't generate JWT");
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('listening on port 3000.......');
  });
};

startServer();
