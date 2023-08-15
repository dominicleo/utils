import { toArray } from './to-array';
import { isFunction, isPlainObject, isValid } from './validate';

const arrayToObject = <T extends any[], P extends T[number], K extends keyof P>(
  items: T,
  key: K | ((item: P) => any),
  childKey?: K,
) => {
  return toArray(items).reduce((memo: Record<K, P>, item) => {
    if (!isPlainObject(item)) return memo;

    const itemKey: K = isFunction(key) ? key(item) : item[key];
    const { [childKey as K]: children, ...rest } = item;

    if (isValid(itemKey)) {
      memo[itemKey] = rest as P;
    }

    if (Array.isArray(children)) {
      memo = {
        ...memo,
        ...arrayToObject(children, key, childKey),
      };
    }

    return memo;
  }, {} as Record<PropertyKey, P>);
};
