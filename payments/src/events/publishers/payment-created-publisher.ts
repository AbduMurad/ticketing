import { PaymentCreatedEvent, Publisher, Subject } from '@am-gittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
}
