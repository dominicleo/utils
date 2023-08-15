import assignWith from 'lodash/assignWith';

export function mergeLeft<A, B>(a: A, b: B): B & A;
export function mergeLeft<A, B, C>(a: A, b: B, c: C): C & B & A;
export function mergeLeft<A, B, C, D>(a: A, b: B, c: C, d: D): D & C & B & A;
export function mergeLeft(...items: any[]) {
  function customizer(left: any, right: any) {
    return right === undefined ? left : right;
  }

  let item = { ...items[0] };
  for (let i = 1; i < items.length; i++) {
    item = assignWith(item, items[i], customizer);
  }
  return item;
}
