import { isPlainObject, isString, isValid } from '../validate';
import { APPEND_ARRAY_REG, ARRAY_REG, CAN_BE_NULL_REG } from './constants';
import type { Segment } from './types';
import { isEmpty } from './util';

export const setIn = (segments: Segment[], source: any, value: any) => {
  segments = segments.slice();
  const [segment] = segments.splice(0, 1);
  return setValue(segment, segments, source, value, false);
};

function setValue(
  segment: Segment,
  segments: Segment[],
  source: any,
  value: any,
  parentIsArray = false,
) {
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

  if (empty) {
    if (isPropertyArray) {
      arrayIndex = match?.[2];
      if (isValueArray) {
        source = {};
        source[segment] = [];
      } else {
        source = [];
      }
    } else {
      source = {};
    }
  } else {
    if (isPlainObject(source)) {
      source = { ...source };
    }

    if (Array.isArray(source)) {
      source = source.slice();
    }

    if (isPropertyArray) {
      arrayIndex = match?.[2];
    }
  }

  if (!segments.length) {
    if (!canBeNull && !isValid(value)) {
      if (parentIsArray && empty) return null;
      if (isValueArray) {
        source[segment] = [];
      }
      return source;
    }

    if (isValueArray) {
      if (!Array.isArray(source[segment])) {
        if (Array.isArray(value)) {
          source[segment] = value;
          return source;
        }
        source[segment] = [];
      }

      if (appendToArray) {
        source[segment].push(value);
        return source;
      }

      if (Array.isArray(value)) {
        source[segment] = value;
        return source;
      }

      return source;
    }

    if (Array.isArray(source)) {
      if (Array.isArray(value)) {
        source = value;
        return source;
      }

      return source;
    }

    source[segment] = value;
    return source;
  }

  if (isValueArray) {
    if (!Array.isArray(source[segment])) {
      source[segment] = [];
    }

    if (
      Array.isArray(value) &&
      isString(segments[0]) &&
      APPEND_ARRAY_REG.test(segments[0])
    ) {
      for (let i = 0; i < value.length; i++) {
        const itemKey = segments[0];
        const sliced = segments.slice(1);
        source[segment][i] = setValue(
          itemKey,
          sliced,
          source[segment][i],
          value[i],
          false,
        );
      }

      return source;
    }

    if (Array.isArray(value) && value.length) {
      const itemKey = segments[0];
      const sliced = segments.slice(1);
      if (!Array.isArray(value[0]) && isValid(arrayIndex)) {
        source[segment][arrayIndex] = setValue(
          segments[0],
          segments.slice(1),
          source[segment][arrayIndex],
          value,
          false,
        );

        return source;
      }

      for (let i = 0; i < value.length; i++) {
        let parentItem = source[segment][i];
        if (parentItem === undefined) parentItem = {};
        source[segment][i] = setValue(
          itemKey,
          sliced,
          parentItem,
          value[i],
          true,
        );
      }

      return source;
    }

    if (isValid(arrayIndex)) {
      source[segment][arrayIndex] = setValue(
        segments[0],
        segments.slice(1),
        source[segment][arrayIndex],
        value,
        false,
      );

      return source;
    }

    if (Array.isArray(source[segment]) && source[segment].length) {
      for (let i = 0; i < source[segment].length; i++) {
        source[segment][i] = setValue(
          segments[0],
          segments.slice(1),
          source[segment][i],
          value,
          false,
        );
      }

      return source;
    }

    return source;
  }

  if (Array.isArray(source)) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        source[i] = setValue(
          segments[0],
          segments.slice(1),
          source[i],
          value[i],
          true,
        );
      }

      return source;
    }

    if (isValid(arrayIndex)) {
      const retval = setValue(
        segments[0],
        segments.slice(1),
        source[arrayIndex as number],
        value,
        true,
      );

      if (retval !== null) {
        source[0] = retval;
      }

      return source;
    }

    return source;
  }

  source[segment] = setValue(
    segments[0],
    segments.slice(1),
    source[segment],
    value,
    false,
  );
  return source;
}
