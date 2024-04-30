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
  protected subscribers = new Map<string | number, SubscriberType>();

  protected each(
    callback: (
      subscriber: SubscriberType,
      index: number,
      subscribers: SubscriberType[],
    ) => void,
  ) {
    const subscribers = Array.from(this.subscribers.values());
    subscribers.forEach((subscriber, index, subscribers) =>
      callback(subscriber, index, subscribers),
    );
  }

  protected map(
    callback: (
      subscriber: SubscriberType,
      index: number,
      subscribers: SubscriberType[],
    ) => any,
  ) {
    const subscribers = Array.from(this.subscribers.values());
    return subscribers.map((subscriber, index, subscribers) =>
      callback(subscriber, index, subscribers),
    );
  }

  protected reduce<T = never>(
    callback: (
      memo: T,
      subscriber: SubscriberType,
      index: number,
      subscribers: SubscriberType[],
    ) => T,
    initialValue: T,
  ) {
    let memo = initialValue;
    this.each((subscriber, index, subscribers) => {
      memo = callback(memo, subscriber, index, subscribers);
    });
    return memo;
  }

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
