export type Nullable<T> = T | null | undefined;

export type Arrayable<T> = T | Array<T>;

export interface Option<T = any, P = any> {
  value: T;
  label: P;
  children?: Option<T>[];
  [key: string]: any;
}
