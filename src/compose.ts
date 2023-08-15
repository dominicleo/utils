export abstract class AbstractComposeProcess<T = any, P = any> {
  value: T;
  props: P;
  constructor(value: T, props: P) {
    this.value = value;
    this.props = { ...props } as P;
  }
  abstract process(): Partial<T>;
}

export type AbstractComposeProcessClass<T = any, P = any> = new (
  value: T,
  props: P,
) => AbstractComposeProcess;

export const compose = <C extends AbstractComposeProcessClass[]>(
  ...functions: C
) => {
  const funcs = functions.filter(
    (fn) => fn?.prototype instanceof AbstractComposeProcess,
  );

  if (funcs.length <= 0) {
    throw new Error('No funcs passed');
  }

  return <T, P>(value: T, props: P) => {
    return funcs.reduce((memo: T, Process) => {
      const next = new Process(memo, props).process();
      return { ...memo, ...next };
    }, value);
  };
};
