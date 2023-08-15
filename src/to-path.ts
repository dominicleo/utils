import { isFunction, isNumber, isString, isSymbol } from './validate';

export type PropertyPath = PropertyKey | PropertyKey[];

export interface ToPathOptions {
  separator?: string;
  preserve?: boolean;
  split?: (path: PropertyPath) => PropertyKey[];
}

const DEFAULT_SEPARATOR = '.';

const ESCAPE_REG = /\\(\\)?/g;

export const toPath = (path: PropertyPath, options?: ToPathOptions) => {
  if (isFunction(options?.split)) return options!.split(path);
  if (isNumber(path) || isSymbol(path)) return [path];
  if (Array.isArray(path)) return path;

  const separator = options?.separator || DEFAULT_SEPARATOR;
  const preserve = separator === '/' ? false : options?.preserve;

  if (isString(path) && preserve !== false && /\//.test(path)) {
    return [path];
  }

  const parts: PropertyKey[] = [];

  const push = (part: string) => {
    let number;

    if (part.trim() !== '' && Number.isInteger((number = Number(part)))) {
      parts.push(number);
      return number;
    }

    parts.push(part);
    return part;
  };

  let part = '';
  for (let i = 0; i < path.length; i++) {
    const value = path[i];

    if (ESCAPE_REG.test(value)) {
      part += path[++i];
      continue;
    }

    if (value.charCodeAt(0) === separator.charCodeAt(0)) {
      push(part);
      part = '';
      continue;
    }

    part += value;
  }

  part && push(part);

  return parts;
};
