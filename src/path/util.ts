import { isEmptyArray, isEmptyObject, isValid } from '../validate';

export const isEmpty = <T = unknown>(value: T): value is NonNullable<T> => {
  if (!isValid(value)) return true;
  if (isEmptyObject(value)) return true;
  if (isEmptyArray(value)) return true;
  return false;
};
