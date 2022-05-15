import { ExpirationCompleteEvent, Publisher, Subject } from '@am-gittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
}
