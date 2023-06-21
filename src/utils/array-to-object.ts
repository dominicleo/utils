import { toArray } from './to-array';

export const arrayToObject = <T extends any[], K extends keyof T[number]>(
  items: T,
  key: K,
) => {
  const entries = toArray(items).map((item) => [item?.[key], item] as const);
  return Object.fromEntries<T[number]>(entries);
};
