import { Subscribable, type Subscriber } from './subscribable';

type SubscriberResult = void | boolean;

export interface CustomEvent<EventData = any, EventContext = any> {
  type: string;
  data?: EventData;
  context?: EventContext;
}

export type CustomEventClass = new (...args: any[]) => any;

export class Event extends Subscribable {
  dispatch<T extends CustomEvent = any>(event: T, context?: any) {
    let interrupted = false;
    (event as any).context = context;
    this.each((subscriber) => {
      if (subscriber(event) === false) {
        interrupted = true;
      }
    });
    return interrupted ? false : true;
  }
  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: Subscriber<InstanceType<T>, SubscriberResult>,
  ) {
    return this.subscribe((event) => {
      if (type && event instanceof type) {
        return subscriber(event);
      }
    });
  }
  subscribeWith<T extends CustomEvent = CustomEvent>(
    type: string | string[],
    subscriber: Subscriber<T, SubscriberResult>,
  ) {
    return this.subscribe((event) => {
      if (Array.isArray(type)) {
        if (type.includes(event?.type)) {
          return subscriber(event);
        }
      } else if (type && event?.type === type) {
        return subscriber(event);
      }
    });
  }
}

// const event = new Event();

// class AEvent implements CustomEvent {
//   type = 'a';
// }

// event.subscribe((event) => {
//   return true;
// });

// event.subscribeTo(AEvent, (event) => {
//   console.log('1');
//   return true;
// });

// event.subscribeTo(AEvent, (event) => {
//   console.log('2');
//   return true;
// });

// const result = event.dispatch(new AEvent());

// console.log(result);
