import { toArray } from '../to-array';
import { DEFAULT_SEPARATOR } from './constants';
import { deleteIn } from './delete';
import { getIn } from './get';
import { Parser } from './parser';
import { setIn } from './set';
import type { PathOptions, Pattern, Segment } from './types';

const PATH_CACHE = new Map<Segment, Path>();

export class Path {
  entire: string;
  segments: Segment[];
  constructor(pattern: Pattern, options?: PathOptions) {
    const parser = new Parser(pattern, options);
    this.segments = parser.parse();
    this.entire = this.segments.join(options?.separator || DEFAULT_SEPARATOR);
  }

  toString() {
    return this.entire?.toString();
  }

  toArray() {
    return this.segments.slice();
  }

  get length() {
    return this.segments.length;
  }

  getIn = (source?: any) => {
    return getIn(this.segments, source);
  };

  setIn = (source?: any, value?: any) => {
    return setIn(this.segments, source, value);
  };

  deleteIn = (source?: any) => {
    return deleteIn(this.segments, source);
  };

  static parse(pattern: Pattern = '', options?: PathOptions): Path {
    if (pattern instanceof Path) {
      const found = PATH_CACHE.get(pattern.entire);
      if (found) return found;

      PATH_CACHE.set(pattern.entire, pattern);
      return pattern;
    }
    // TODO support parent path
    // const base = options?.base;
    // const entire = base ? Path.parse(base) : '';
    // const key = `${pattern.toString()}:${entire}`;
    const key = toArray(pattern)
      .map((item) => item.toString())
      .join();
    const found = PATH_CACHE.get(key);
    if (found) return found;

    pattern = new Path(pattern, options);
    PATH_CACHE.set(key, pattern);
    return pattern;
  }

  static getIn = (source: any, pattern: Pattern) => {
    return Path.parse(pattern).getIn(source);
  };

  static setIn = (source: any, pattern: Pattern, value: any) => {
    return Path.parse(pattern).setIn(source, value);
  };

  static deleteIn = (source: any, pattern: Pattern) => {
    return Path.parse(pattern).deleteIn(source);
  };
}
