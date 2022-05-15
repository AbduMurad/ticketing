import { Listener } from '../../../common/src/events/base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@am-gittix/common';
import { Subject } from '@am-gittix/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subject.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data! ', data);

    msg.ack();
  }
}
