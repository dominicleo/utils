import { isString } from './validate';

const SPACE_REG = /\s+/g;
const OPERATOR_REG = /[+-]/;
const DEFAULT_SEPARATOR = '&';

export interface TradeIntervalOptions {
  date?: Date;
}

/**
 *
 * @param value - T+1、T0+1
 * @returns {number}
 */
export const tradeInterval = (
  value?: string,
  options?: TradeIntervalOptions,
) => {
  if (!isString(value)) return;

  value = value.replace(SPACE_REG, '');

  const match = value.match(OPERATOR_REG);
  if (!match) return;

  const [operator] = match;
  const target = value.split(OPERATOR_REG).find((item) => !/^T/i.test(item));
  const interval = parseFloat(operator + target);

  const now = options?.date?.getTime?.() || Date.now();

  return now + interval * 24 * 60 * 60 * 1000;
};

export interface TradeIntervalRangeOptions extends TradeIntervalOptions {
  separator?: string;
}

/**
 *
 * @param value - T+0&T+1
 * @returns {number[]}
 */
export const tradeIntervalRange = (
  value?: string,
  options?: TradeIntervalRangeOptions,
) => {
  if (!isString(value)) return [];
  const separator = options?.separator || DEFAULT_SEPARATOR;
  const items = value
    .split(separator)
    .map((item) => tradeInterval(item, options));
  const target = items.filter(Boolean) as number[];
  const min = Math.min(...target);
  const max = Math.max(...target);
  return [min, max];
};
