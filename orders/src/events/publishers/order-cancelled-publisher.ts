import { Publisher, OrderCancelledEvent, Subject } from '@am-gittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}
