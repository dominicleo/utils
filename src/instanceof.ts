import { isFunction, isString } from './validate';

export const instanceOf = <T>(
  value: T,
  constructor: any,
): value is Exclude<T, undefined | null> => {
  if (isFunction(constructor)) return value instanceof constructor;

  if (isString(constructor)) {
    const context: Record<string, any> = window;
    return context[constructor] ? value instanceof context[constructor] : false;
  }

  return false;
};
