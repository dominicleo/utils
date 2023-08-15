import { isFunction } from '../validate';
import type { CustomEvent, CustomEventClass } from './types';

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export type Subscriber<Payload = any> = (
  payload: Payload,
) => void | boolean | Promise<void | boolean>;

export interface Unsubscribe {
  (): void;
  [UNSUBSCRIBE_ID_SYMBOL]?: number;
}

export class Subscribable<ExtendsType = any> {
  private subscribers: {
    index: number;
    [key: number]: Subscriber;
  } = {
    index: 0,
  };

  dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    const subscribers: Subscriber[] = [];
    for (const key in this.subscribers) {
      if (isFunction(this.subscribers[key])) {
        (event as any).context = context;
        subscribers.push(this.subscribers[key]);
      }
    }

    return Promise.all(subscribers.map((subscriber) => subscriber(event))).then(
      (results) => results.every((result) => result !== false),
    );
  }

  subscribe(subscriber: Subscriber) {
    let id: number;
    if (isFunction(subscriber)) {
      id = this.subscribers.index + 1;
      this.subscribers[id] = subscriber;
      this.subscribers.index += 1;
    }

    const unsubscribe: Unsubscribe = () => {
      this.unsubscribe(id);
    };

    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id!;

    return unsubscribe;
  }

  subscribeTo<T extends CustomEventClass>(
    type: T,
    subscriber: Subscriber<InstanceType<T>>,
  ) {
    return this.subscribe((event) => {
      if (type && event instanceof type) {
        return subscriber(event);
      }
    });
  }

  subscribeWith<T extends CustomEvent = CustomEvent>(
    type: string | string[],
    subscriber: Subscriber<T>,
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

  unsubscribe(id?: number | string | Unsubscribe) {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key);
      }
      return;
    }
    if (isFunction(id)) {
      delete this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]!];
    } else {
      delete this.subscribers[id as number];
    }
  }
}
