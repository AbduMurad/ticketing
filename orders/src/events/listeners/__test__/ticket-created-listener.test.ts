import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create listener instance
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake data event
  const data = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'museum',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //  @ts-ignore
  // create fake message Object
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage fn with the data object + message object
  await listener.onMessage(data, msg);

  // assert ticket creation
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call oMessage fn with the data object + message object
  await listener.onMessage(data, msg);

  // assert that ack fn is called
  expect(msg.ack).toHaveBeenCalled();
});
