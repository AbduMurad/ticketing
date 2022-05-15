import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import mongoose from 'mongoose';

const buildTicket = async (title: string) => {
  const ticket = Ticket.build({
    title,
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
};

it('fetches all orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket('concert');
  const ticketTwo = await buildTicket('museum');
  const ticketThree = await buildTicket('festival');

  // Remembering users for after use
  const userOneCookies = global.signin();
  const userTwoCookies = global.signin();

  // Create one order as User #1
  const { body: user1order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOneCookies)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: user2order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookies)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: user2order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookies)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make requests to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwoCookies)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toBe(2);
  expect(response.body).toEqual([user2order1, user2order2]);
});
