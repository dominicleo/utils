import { toArray } from './to-array';

export const arrayToMap = <T extends any[], K extends keyof T[number]>(
  items: T,
  key: K,
): Map<string, T[number]> => {
  return new Map(toArray(items).map((item) => [item?.[key], item] as const));
};
