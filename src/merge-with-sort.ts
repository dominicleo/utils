import differenceWith from 'lodash/differenceWith';
import intersectionWith from 'lodash/intersectionWith';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { arrayToObject } from './array-to-object';
import { mergeLeft } from './merge-left';
import { toArray } from './to-array';

const createComparator =
  <T extends Record<string, any>>(key: string) =>
  (left: T, right: T) => {
    return left[key] === right[key];
  };

interface MergeWithSortOptions<T> {
  key: string;
  include?: string[];
  exclude?: string[];
  customizer?: (source: T, target: T) => T;
}

const DEFAULT_OPTIONS = {};

export const mergeWithSort = <T extends any[]>(
  source?: T,
  target?: T,
  opts?: MergeWithSortOptions<T[number]>,
): T => {
  const options = mergeLeft(DEFAULT_OPTIONS, opts);

  const filter = (item: any) => {
    if (Array.isArray(options.include)) {
      item = pick(item, options.include);
    }

    if (Array.isArray(options.exclude)) {
      item = omit(item, options.exclude);
    }

    return item as T[number];
  };

  if (!Array.isArray(target) || !target?.length) {
    return toArray(source).map(filter) as T;
  }

  const comparator = createComparator(options.key);
  const intersection = intersectionWith(source, target, comparator);
  const difference = differenceWith(source, target, comparator).map(filter);
  const INTERSECTION_MAP = arrayToObject(intersection, options.key);

  const sorted = toArray(target).reduce((memo: T, item) => {
    const finded = INTERSECTION_MAP[item[options.key]];
    if (!finded) return memo;

    const left = filter(finded);
    const right = filter(item);

    return memo.concat(
      isFunction(options.customizer)
        ? options.customizer(left, right)
        : { ...left, ...right },
    );
  }, []);

  return sorted.concat(difference);
};
