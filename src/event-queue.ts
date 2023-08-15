import { getPriority } from './get-priority';
import { isFunction } from './validate';

const TASK_OPTIONS_SYMBOL = Symbol('TASK_OPTIONS');
const REMOVE_ID_SYMBOL = Symbol('REMOVE_ID_SYMBOL');

export interface EventQueueTaskOptions {
  priority?: number;
}

export interface EventQueueTask<T = any> {
  (value: T): T | Promise<T>;
  [TASK_OPTIONS_SYMBOL]?: EventQueueTaskOptions;
}

export interface Removeble {
  (): void;
  [REMOVE_ID_SYMBOL]?: number;
}

export class EventQueue<T = any> {
  private tasks: {
    index: number;
    [key: number]: EventQueueTask<T>;
  } = {
    index: 0,
  };

  add(task: EventQueueTask<T>, options?: EventQueueTaskOptions) {
    let id: number;

    if (isFunction(task)) {
      id = this.tasks.index + 1;
      task[TASK_OPTIONS_SYMBOL] = options;
      this.tasks[id] = task;
      this.tasks.index += 1;
    }

    const remove: Removeble = () => {
      this.remove(id);
    };

    remove[REMOVE_ID_SYMBOL] = id!;

    return remove;
  }

  remove(id?: number | string | Removeble) {
    if (id === undefined || id === null) {
      for (const key in this.tasks) {
        this.remove(key);
      }
      return;
    }
    if (isFunction(id)) {
      delete this.tasks[id[REMOVE_ID_SYMBOL]!];
    } else {
      delete this.tasks[id as number];
    }
  }

  exec(value: T) {
    const tasks: EventQueueTask<T>[] = [];
    for (const key in this.tasks) {
      if (isFunction(this.tasks[key])) {
        tasks.push(this.tasks[key]);
      }
    }

    const promise = Promise.resolve(value);

    if (!tasks.length) return value;

    tasks.sort(
      (left, right) =>
        getPriority(left[TASK_OPTIONS_SYMBOL]?.priority) -
        getPriority(right[TASK_OPTIONS_SYMBOL]?.priority),
    );

    return tasks.reduce((memo: Promise<T>, task) => {
      return memo.then(task);
    }, promise);
  }
}
