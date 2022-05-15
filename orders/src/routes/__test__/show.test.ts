import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order for the user if that user is the one who made the order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const userOneCookies = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOneCookies)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOneCookies)
    .send()
    .expect(200);

  expect(fetchedOrder).toEqual(order);
});

it('return error if the order to be fetched for the user was not made by the user', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const userOneCookies = global.signin();
  const userTwoCookies = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOneCookies)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwoCookies)
    .send()
    .expect(401);
});
