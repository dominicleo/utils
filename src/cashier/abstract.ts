import { mergeLeft } from '../merge-left';
import {
  ALIPAY_SDK_URL,
  MICROAPP_PATH,
  TIKTOK_SDK_URL,
  WECHAT_SDK_URL,
} from './constants';
import type {
  CashierOptions,
  CashierParams,
  CashierStrategyClass,
  CashierStrategyClassType,
} from './types';

const defaultOptions = {
  WECHAT_SDK_URL,
  ALIPAY_SDK_URL,
  TIKTOK_SDK_URL,
  MICROAPP_PATH,
};

export abstract class AbstractCashier {
  params: CashierParams;
  options: CashierOptions;
  strategy?: CashierStrategyClass;
  constructor(params: CashierParams, options?: CashierOptions) {
    this.params = params;
    this.options = mergeLeft(defaultOptions, options);
    this.load?.();
  }
  load?(): void;
  async request() {
    const Strategy = this.strategy;
    if (!Strategy) {
      return Promise.reject(
        new CashierError(
          `${this.params.type} type is not supported temporarily`,
        ),
      );
    }

    const strategy = new Strategy(this.params, this.options);
    await strategy.load?.();
    await strategy.validate?.();
    return strategy.request();
  }
}

export abstract class AbstractCashierStrategy
  implements CashierStrategyClassType
{
  params: CashierParams;
  options: CashierOptions;
  constructor(params: CashierParams, options?: CashierOptions) {
    this.params = params;
    this.options = { ...options };
  }
  load?(): void;
  validate?(): void;
  abstract request(): void;
}

export class CashierError extends Error {
  name = 'CashierError';
  constructor(message?: string) {
    super(message);
    this.message = message ?? '';
  }
  is(error: unknown): error is CashierError {
    return error instanceof CashierError;
  }
}
