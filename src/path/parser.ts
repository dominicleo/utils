import { Path } from '.';
import { isFunction, isNumber, isString, isSymbol } from '../validate';
import { DEFAULT_SEPARATOR, ESCAPE_REG } from './constants';
import type { PathOptions, Pattern, Segment } from './types';

export class Parser {
  private pattern: Pattern;
  private options?: PathOptions;
  constructor(pattern: Pattern, options?: PathOptions) {
    this.pattern = pattern;
    this.options = options;
  }
  parse() {
    const pattern = this.pattern;
    const split = this.options?.split;

    if (pattern instanceof Path) return pattern.segments;
    if (isFunction(split)) return split(pattern);
    if (isNumber(pattern) || isSymbol(pattern)) return [pattern];
    if (Array.isArray(pattern)) return pattern;

    const separator = this.options?.separator || DEFAULT_SEPARATOR;
    const preserve = separator === '/' ? false : this.options?.preserve;

    if (isString(pattern) && preserve !== false && /\//.test(pattern)) {
      return [pattern];
    }

    const segments: Segment[] = [];

    const push = (segment: string) => {
      const key = segment.trim();

      if (key === '') return;

      const index = Number(segment);
      if (Number.isInteger(index)) {
        segments.push(index);
        return;
      }

      segments.push(key);
    };

    let segment = '';

    for (let i = 0; i < pattern.length; i++) {
      const value = pattern[i];

      if (ESCAPE_REG.test(value)) {
        segment += pattern[++i];
        continue;
      }

      if (value.charCodeAt(0) === separator.charCodeAt(0)) {
        push(segment);
        segment = '';
        continue;
      }

      segment += value;
    }

    segment && push(segment);

    return segments;
  }
}
