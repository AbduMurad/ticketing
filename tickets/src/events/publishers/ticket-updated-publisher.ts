import { Publisher, Subject, TicketUpdatedEvent } from '@am-gittix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subject.TicketUpdated;
}
