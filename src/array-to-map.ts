import { toArray } from './to-array';
import { isFunction, isPlainObject, isValid } from './validate';

export const arrayToMap = <
  T extends any[],
  P extends T[number],
  K extends keyof P,
>(
  items: T,
  key: K | ((item: P) => any),
  childKey?: K,
) => {
  const entries = toArray(items).reduce((memo: [any, P][], item) => {
    if (!isPlainObject(item)) return memo;

    const itemKey = isFunction(key) ? key(item) : item[key];
    const { [childKey as K]: children, ...rest } = item;

    if (isValid(itemKey)) {
      memo = memo.concat([[itemKey, rest as P]]);
    }

    if (Array.isArray(children)) {
      memo = memo.concat(
        Array.from(arrayToMap(children, key, childKey).entries()),
      );
    }

    return memo;
  }, []);

  return new Map(entries);
};
