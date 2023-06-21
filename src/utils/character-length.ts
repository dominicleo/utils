import { isString } from './validate';

const FULL_WIDTH_CHARACTERS = /[^\x{00}-\xff]/g;

export const characterLength = (value?: string) => {
  if (!isString(value)) return 0;
  return value.replace(FULL_WIDTH_CHARACTERS, '00').length;
};
