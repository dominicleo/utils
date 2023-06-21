import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { isString, isValidNumber } from './utils';

dayjs.extend(duration);

// const source = { a: { b: 1 }, c: [{ d: 2 }, { d: 2 }] };
// set(source, 'c[*].d', 3);
// set(source, 'c[0].d', 3);
// set(source, ['c[]', 'd'], 3);

// set(source, 'a.b.c', 1);
// set(source, 'a\\.b\\.c', 1);
// set(source, 'https://github.com', 1);
// set(source, 'https://github.com', 1, { preserve: false });

const TRADE_INTERVAL_REG = /(T?\d+)([+-])(T?\d+)/g;

const tradeInterval = (value?: string) => {
  const today = dayjs();
  const timestamp = today.valueOf();

  if (!isString(value)) return timestamp;

  const match = TRADE_INTERVAL_REG.exec(value);
  console.log(match, value);

  if (!match) return timestamp;

  const [, left, operator, right] = match;
  const target = [left, right].find((value) => !/^T/i.test(value));
  const interval = parseFloat(operator + target!);

  if (!isValidNumber(interval)) return timestamp;

  return today.add(interval, 'day').valueOf();
};

const tradeIntervalRange = (
  value?: string,
  separator: string | RegExp = '&',
) => {
  if (!isString(value)) return [0, 0];
  const values = value.split(separator).map(tradeInterval);
  console.log(value.split(separator), values);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return [min, max];
};

// const value = '2+T1';
// console.log(dayjs(tradeInterval(value)).format('YYYY-MM-DD'));

const valueRange = 'T1+0&T1+2';
const [min, max] = tradeIntervalRange(valueRange);
// console.log(dayjs(min).format('YYYY-MM-DD'), dayjs(max).format('YYYY-MM-DD'));

// export const tradeInterval = (value: string) => {
//   if (!isString(value)) return;
//   const target = value.replace(/^T/i, '');
//   const interval = parseFloat(target);
//   if (!isValidNumber(interval)) return;

//   return dayjs().add(interval, 'day').valueOf();
// };

// const FORMAT = 'YYYY-MM-DD';
// const today = dayjs().format(FORMAT);
// const result = dayjs(tradeInterval(value)).format(FORMAT);

// console.log('today', today);
// console.log('result', result);
