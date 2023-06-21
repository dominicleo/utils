import { isString } from '.';
import { toPath, type PathOptions, type PropertyPath } from './to-path';

export type SetSourceType = object | any[];

export interface SetOptions extends PathOptions {}

const ARRAY_REG = /(\[\]|\[(.*)\])$/g;
const APPEND_ARRAY_REG = /(\[\]|\[(.*)\]\+)$/g;

const ARRAY_WILDCARD = ['',  '*'];

export const set = <T extends SetSourceType>(
  source: T,
  path: PropertyPath,
  value: any,
  options?: SetOptions,
) => {
  const keys = toPath(path, options);
  const [key] = keys;

  return setValue(source, key, keys, value, -1);
};

const setValue = <T extends SetSourceType>(
  source: T,
  key: PropertyKey,
  keys: PropertyKey[],
  value: any,
  depth: number,
  parentIsArray = false,
) => {

  let currentKey = key;
  let currentValue;

  depth++;

  if (isString(currentKey)) {
    let match = ARRAY_REG.exec(currentKey);
    console.log(match);
  }


  // source[key] = setValue(source[key], keys[0], keys.slice(1), value, depth);
  return source;
};
