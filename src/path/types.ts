import type { Path } from './index';

export type Segment = string | number | symbol;

export type Pattern = Segment | Segment[] | Path;

export interface PathOptions {
  // base?: Pattern;
  separator?: string;
  preserve?: boolean;
  split?: (pattern: Pattern) => Segment[];
}
