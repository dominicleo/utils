import type { Option } from './types';
import { isPlainObject } from './validate';

export const objectToOptions = <T extends object>(data?: T): Option[] => {
  if (!isPlainObject(data)) return [];
  return Object.entries(data).map(([value, label]) => ({ value, label }));
};
