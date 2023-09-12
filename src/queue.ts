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

export class Queue<T = any> extends Subscribable<
  Subscriber<T, SubscriberResult<T>>
> {
  add(task: QueueSubscriber<T>, options?: any) {
    task[TASK_OPTIONS_SYMBOL] = options;
    return this.subscribe(task);
  }
  run(value: T) {
    const promise = Promise.resolve(value);
    const subscribers: QueueSubscriber<T>[] = [];

    this.each((subscriber) => {
      subscribers.push(subscriber);
    });

    if (!subscribers.length) return promise;

    return subscribers.reduce((memo: Promise<T>, subscriber) => {
      return memo.then(subscriber);
    }, promise);
  }
}

const q = new Queue<{ a: number }>();

q.add((data) => {
  data.a = 3;
  return data;
});

q.add(
  (data) => {
    data.a = 2;
    return data;
  },
  { priority: 0 },
);

(async () => {
  const result = await q.run({ a: 1 });

  console.log(result);
})();
