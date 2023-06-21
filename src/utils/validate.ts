import { instanceOf } from './instanceof';

export const toString = (value: unknown) =>
  Object.prototype.toString.call(value);

const has = Object.prototype.hasOwnProperty;
const isType =
  <T>(type: string | string[]) =>
  (value: unknown): value is T =>
    value !== null &&
    (Array.isArray(type) ? type : [type]).some(
      (string) => toString(value) === `[object ${string}]`,
    );

export const isFunction = isType<(...args: any[]) => any>([
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
]);

export const isWindow = isType<Window>('Window');
export const isBrowser = typeof window !== 'undefined';
export const isHTMLElement = (element: any): element is HTMLElement => {
  return element?.nodeName || element?.tagName;
};

export const isString = isType<string>('String');
export const isNumber = isType<number>('Number');
export const isBoolean = isType<boolean>('Boolean');
export const isPlainObject = isType<Record<PropertyKey, any>>('Object');
export const isObject = (value: unknown) =>
  value !== null && typeof value === 'object';
export const isRegExp = isType<RegExp>('RegExp');
export const isSymbol = (value: unknown): value is symbol =>
  typeof value === 'symbol';
export const isNull = (value: unknown) => value == null;
export const isUndefined = (value: unknown) => value === undefined;
export const isValid = (value: unknown) =>
  value !== null && value !== undefined;
export const isValidNumber = (value: any): value is number =>
  !Number.isNaN(value) && isNumber(value);

export const isEmpty = (value: any, strict = false) => {
  if (isNull(value)) return true;

  if (isBoolean(value)) return false;

  if (isValidNumber(value)) return false;

  if (isString(value)) return value.length === 0;

  if (isFunction(value)) return value.length === 0;

  if (isEmptyObject(value)) return true;

  if (isEmptyArray(value, strict)) return true;

  if (instanceOf(value, 'Error')) return value.message === '';

  if (value.toString === toString) {
    switch (value.toString()) {
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return value.size === 0;
      }
    }
  }

  return false;
};

export const isEmptyObject = <T extends object>(value: T) => {
  if (!isObject(value)) return false;

  for (const key in value) {
    if (has.call(value, key)) {
      return false;
    }
  }

  return true;
};

export const isEmptyArray = <T extends any[]>(value: T, strict = false) => {
  if (!Array.isArray(value)) return false;

  if (value.length === 0) {
    return true;
  }

  for (let i = 0; i < value.length; i++) {
    if (strict) {
      if (isValid(value)) {
        return false;
      }
    } else {
      if (
        value[i] !== undefined &&
        value[i] !== null &&
        value[i] !== '' &&
        value[i] !== 0
      ) {
        return false;
      }
    }
  }

  return true;
};
