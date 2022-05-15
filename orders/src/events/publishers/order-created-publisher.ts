import { Publisher, OrderCreatedEvent, Subject } from '@am-gittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
