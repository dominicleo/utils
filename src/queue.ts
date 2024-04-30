import { getPriority } from './get-priority';
import { Subscribable, type Subscriber } from './subscribable';

const TASK_OPTIONS_SYMBOL = Symbol('TASK_OPTIONS');

type SubscriberResult<T = any> = T | Promise<T>;

export interface QueueSubscriberOptions {
  priority?: number;
}

export interface QueueSubscriber<T = any>
  extends Subscriber<T, SubscriberResult<T>> {
  [TASK_OPTIONS_SYMBOL]?: QueueSubscriberOptions;
}

export type QueueErrorHandler = (error: any) => any;

export class Queue<T = any> extends Subscribable<
  Subscriber<T, SubscriberResult<T>>
> {
  private handleError?: QueueErrorHandler;

  error(handler: QueueErrorHandler) {
    this.handleError = handler;
  }

  add(task: QueueSubscriber<T>, options?: any) {
    task[TASK_OPTIONS_SYMBOL] = options;
    const remove = this.subscribe(task);
    const subscribers: [string | number, QueueSubscriber<T>][] = Array.from(
      this.subscribers,
    );

    subscribers.sort(
      ([, left], [, right]) =>
        getPriority(left[TASK_OPTIONS_SYMBOL]?.priority) -
        getPriority(right[TASK_OPTIONS_SYMBOL]?.priority),
    );

    this.subscribers = new Map(subscribers);

    return remove;
  }

  run(value: T) {
    const promise = Promise.resolve(value);
    return this.reduce((memo: Promise<T>, subscriber) => {
      return memo.then(subscriber).catch(this.handleError);
    }, promise);
  }
}

// const q = new Queue<{ a: number }>();

// q.add((data) => {
//   data.a = 3;
//   return data;
// });

// q.add(
//   (data) => {
//     data.a = 2;
//     return data;
//   },
//   // { priority: 0 },
// );

// // q.unsubscribe();

// (async () => {
//   const result = await q.run({ a: 1 });
//   console.log(result);
// })();
