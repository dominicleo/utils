import { isFunction, isString } from './validate';

export const instanceOf = (value: any, constructor: any) => {
  if (isFunction(constructor)) return value instanceof constructor;

  if (isString(constructor)) {
    const context: Record<string, any> = window;
    return context[constructor] ? value instanceof context[constructor] : false;
  }

  return false;
};
