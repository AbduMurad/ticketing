import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ValidateRequest,
} from '@am-gittix/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .withMessage('Ticket Must be provided')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (userId !== order.userId) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
