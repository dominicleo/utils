import { Subscribable, type Subscriber } from './subscribable';

type SubscriberResult = void | boolean;
type SubscriberAsyncResult = void | boolean | Promise<void | boolean>;

export interface CustomEvent<EventData = any, EventContext = any> {
  type: string;
  data?: EventData;
  context?: EventContext;
}

export type CustomEventClass = new (...args: any[]) => any;

class EventAsync extends Subscribable<Subscriber<any, SubscriberAsyncResult>> {
  dispatch<T extends CustomEvent>(event: T, context?: any) {
    (event as any).context = context;

    const promises = this.map((subscriber) => {
      return subscriber(event);
    });

    return Promise.all(promises).then((results) =>
      results.every((result) => result !== false),
    );
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: Subscriber<InstanceType<T>, SubscriberAsyncResult>,
  ) {
    return this.subscribe((event) => {
      if (type && event instanceof type) {
        return subscriber(event);
      }
    });
  }
}

export class Event extends Subscribable<Subscriber<any, SubscriberResult>> {
  dispatch<T extends CustomEvent>(event: T, context?: any) {
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

  subscribeWith<T extends CustomEvent>(
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

  static async() {
    return new EventAsync();
  }
}

// class PreposeEvent implements CustomEvent {
//   type = 'prepose';
// }

// const event = new EventAsync();

// (async () => {
//   event.subscribe(() => {
//     return false;
//   });
//   const a = await event.dispatch(new PreposeEvent());
//   console.log(a);
// })();
