import type { Arrayable, Nullable } from './types';

export const toArray = <T>(array?: Nullable<Arrayable<T>>): Array<T> => {
  array = array ?? [];
  return Array.isArray(array) ? array : [array];
};
