import { isFunction } from './validate';

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export type Subscriber<Payload = any, Result = any> = (
  payload: Payload,
) => Result;

export interface Unsubscribe {
  (): void;
  [UNSUBSCRIBE_ID_SYMBOL]?: number;
}

export class Subscribable<SubscriberType extends Subscriber = Subscriber> {
  private index = 0;
  private subscribers = new Map<string | number, SubscriberType>();

  reduce<T = never>(
    callback: (memo: T, subscriber: SubscriberType) => T,
    initialValue: T,
  ) {
    let memo = initialValue;
    this.each((subscriber) => {
      memo = callback(memo, subscriber);
    });
    return memo;
  }

  each(callback: (subscriber: SubscriberType) => void) {
    this.subscribers.forEach((subscriber) => callback(subscriber));
  }

  // dispatch<T extends ExtendsType = any>(event: T, context?: any) {
  //   const subscribers: SubscriberType[] = [];
  //   for (const key in this.subscribers) {
  //     if (isFunction(this.subscribers[key])) {
  //       (event as any).context = context;
  //       subscribers.push(this.subscribers[key]);
  //     }
  //   }

  //   return Promise.all(subscribers.map((subscriber) => subscriber(event))).then(
  //     (results) => results.every((result) => result !== false),
  //   );
  // }

  subscribe(subscriber: SubscriberType) {
    let id: number;
    if (isFunction(subscriber)) {
      id = this.index + 1;
      this.subscribers.set(id, subscriber);
      this.index++;
    }

    const unsubscribe: Unsubscribe = () => {
      this.unsubscribe(id);
    };

    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id!;

    return unsubscribe;
  }

  unsubscribe(id?: number | string | Unsubscribe) {
    if (id === undefined || id === null) {
      this.subscribers.clear();
      return;
    }

    if (isFunction(id)) {
      this.subscribers.delete(id[UNSUBSCRIBE_ID_SYMBOL]!);
    } else {
      this.subscribers.delete(id);
    }
  }
}
