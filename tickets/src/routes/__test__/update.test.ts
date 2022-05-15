import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'qwerty', price: 20 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'qwerty', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'qwerty',
      price: 10,
    })
    .expect(201);

  const ticketId = response.body.id;
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', global.signin())
    .send({ title: 'asdfgh', price: 20 })
    .expect(401);
});

it('returns 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'qwerty',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfgh',
      price: -10,
    })
    .expect(400);
});

it('returns a 400 error if the ticket is rserved', async () => {
  const cookie = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'qwerty',
      price: 10,
    });

  const ticket = await Ticket.findById(body.id);

  ticket!.set({ orderId });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new Title',
      price: 10,
    })
    .expect(400);
});

it('updated the ticket if exists and title and price are valid', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'qwerty',
      price: 10,
    });

  const ticketId = response.body.id;
  const updatedTitle = 'New Title';
  const updatedPrice = 10000;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(updatedTitle);
  expect(ticketResponse.body.price).toEqual(updatedPrice);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'qwerty',
      price: 10,
    });

  const ticketId = response.body.id;
  const updatedTitle = 'New Title';
  const updatedPrice = 10000;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
