import { isValidNumber } from './validate';

export const getPriority = (value: unknown) => {
  return isValidNumber(value) ? value : Infinity;
};
