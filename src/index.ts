import { set } from './utils';

const source = { a: { b: 1 }, c: [{ d: 2 }, { d: 2 }] };
set(source, 'c[*].d', 3);
// set(source, 'c[0].d', 3);
// set(source, ['c[]', 'd'], 3);

// set(source, 'a.b.c', 1);
// set(source, 'a\\.b\\.c', 1);
// set(source, 'https://github.com', 1);
// set(source, 'https://github.com', 1, { preserve: false });
