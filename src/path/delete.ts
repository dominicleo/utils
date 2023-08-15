import { isPlainObject, isString, isValid } from '../validate';
import { APPEND_ARRAY_REG, ARRAY_REG, CAN_BE_NULL_REG } from './constants';
import type { Segment } from './types';
import { isEmpty } from './util';

export const deleteIn = (segments: Segment[], source: any) => {
  segments = segments.slice();
  const [segment] = segments.splice(0, 1);
  return deleteValue(segment, segments, source);
};

function deleteValue(segment: Segment, segments: Segment[], source: any) {
  let match: RegExpExecArray | null = null;
  let appendToArray: RegExpExecArray | null = null;

  let arrayIndex: Segment | undefined;
  let canBeNull = false;
  let isPropertyArray = false;
  let isValueArray = false;

  if (isString(segment)) {
    canBeNull = CAN_BE_NULL_REG.test(segment);
    if (canBeNull) {
      segment = segment.replace(CAN_BE_NULL_REG, '');
    }

    match = ARRAY_REG.exec(segment);

    if (match) {
      isPropertyArray = true;
      segment = segment.replace(ARRAY_REG, '');
      isValueArray = segment !== '';
    }

    appendToArray = APPEND_ARRAY_REG.exec(segment);
    if (appendToArray) {
      match = appendToArray;
      isPropertyArray = true;
      isValueArray = segment !== '';
      segment = segment.replace(APPEND_ARRAY_REG, '');
    }
  }

  const empty = isEmpty(source);

  if (empty) return source;

  if (isPlainObject(source)) {
    source = { ...source };
  }

  if (Array.isArray(source)) {
    source = source.slice();
  }

  if (isPropertyArray) {
    arrayIndex = match?.[2];
  }

  if (!segments.length) {
    if (Array.isArray(source[segment])) {
      if (isValid(arrayIndex)) {
        source[segment].splice(arrayIndex as number, 1);
        return source;
      }

      delete source[segment];
      return source;
    }

    if (Array.isArray(source)) {
      if (isValid(arrayIndex)) {
        source.splice(arrayIndex as number, 1);
        return source;
      }

      source = [];
      return source;
    }

    delete source[segment];
    return source;
  }

  if (isValueArray) {
    if (Array.isArray(source[segment])) {
      source[segment] = source[segment].slice();
    }

    if (isValid(arrayIndex)) {
      source[segment][arrayIndex] = deleteValue(
        segments[0],
        segments.slice(1),
        source[segment][arrayIndex],
      );

      return source;
    }

    if (Array.isArray(source[segment]) && source[segment].length) {
      for (let i = 0; i < source[segment].length; i++) {
        source[segment][i] = deleteValue(
          segments[0],
          segments.slice(1),
          source[segment][i],
        );
      }

      return source;
    }

    return source;
  }

  if (Array.isArray(source)) {
    if (isValid(arrayIndex)) {
      return source;
    }

    for (let i = 0; i < source.length; i++) {
      source[i] = deleteValue(segments[0], segments.slice(1), source[i]);
    }

    return source;
  }

  source[segment] = deleteValue(
    segments[0],
    segments.slice(1),
    source[segment],
  );

  return source;
}
