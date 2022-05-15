import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@am-gittix/common';

const setup = async () => {
  // create listener instance
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create new fake ticket data
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'concert',
  });

  await ticket.save();

  // create fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: 1,
    id: ticket.id,
    title: 'museum',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //  @ts-ignore
  // create fake message Object
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('updates a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  expect(ticket.title).toEqual('concert');

  // call onMessage fn with the data object + message object
  await listener.onMessage(data, msg);

  // assert ticket update
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack the message if the event data version number is not the next to the stored data version number', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
