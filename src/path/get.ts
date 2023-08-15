import { isString, isValid } from '../validate';
import { ARRAY_REG } from './constants';
import type { Segment } from './types';

export const getIn = (segments: Segment[], source: any) => {
  segments = segments.slice();
  const [segment] = segments.splice(0, 1);

  const result = getValue(segment, segments, source);

  return arrayOfUndefined(result);
};

function arrayOfUndefined(value: any) {
  if (!Array.isArray(value)) return value;

  const items = value.flat(Infinity);
  if (!items.length) return undefined;
  return scanArrayForValue(items, value);
}

function scanArrayForValue(items: any, value: any) {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (isValid(item)) return value;
  }
}

function getValue(segment: Segment, segments: Segment[], source: any) {
  let match: RegExpExecArray | null = null;
  let arrayIndex: Segment | undefined;
  let isValueArray = false;
  let result: any;

  if (!source) return source;

  if (isString(segment)) {
    match = ARRAY_REG.exec(segment);
    if (match) {
      segment = segment.replace(ARRAY_REG, '');
      isValueArray = segment !== '';
      arrayIndex = match[2];
    }
  }

  if (!segments.length) {
    if (isValueArray) {
      if (arrayIndex === undefined || source[segment] === undefined) {
        result = source[segment];
      } else {
        result = source[segment][arrayIndex];
      }
    } else if (Array.isArray(source)) {
      if (segment === '') {
        if (arrayIndex === undefined) {
          result = source;
        } else {
          result = source[arrayIndex];
        }
      } else {
        result = source.map((item) => {
          return item[segment];
        });
      }
    } else {
      result = source[segment];
    }
  } else {
    if (isValueArray) {
      if (Array.isArray(source[segment])) {
        if (arrayIndex === undefined) {
          result = source[segment].map((item) => {
            return getValue(segments[0], segments.slice(1), item);
          });
        } else {
          result = getValue(
            segments[0],
            segments.slice(1),
            source[segment][arrayIndex],
          );
        }
      } else {
        if (arrayIndex === undefined) {
          result = getValue(segments[0], segments.slice(1), source[segment]);
        } else {
          if (source[segment] === undefined) {
            return;
          }
          result = getValue(
            segments[0],
            segments.slice(1),
            source[segment][arrayIndex],
          );
        }
      }
    } else if (Array.isArray(source)) {
      if (segment === '') {
        if (arrayIndex === undefined) {
          result = getValue(segments[0], segments.slice(1), source);
        } else {
          result = getValue(segments[0], segments.slice(1), source[arrayIndex]);
        }
      } else {
        result = source.forEach((item) => {
          result = getValue(segments[0], segments.slice(1), item);
        });
      }
      if (arrayIndex === undefined) {
        result = source.map((item) => {
          return getValue(segments[0], segments.slice(1), item);
        });
      } else {
        result = getValue(segments[0], segments.slice(1), source[arrayIndex]);
      }
    } else {
      result = getValue(segments[0], segments.slice(1), source[segment]);
    }
  }

  return result;
}
