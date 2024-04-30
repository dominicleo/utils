import { CASHIER_ENV, CASHIER_TYPE } from './enum';

export type CashierEnv = `${CASHIER_ENV}` | (string & {});

export type CashierType = `${CASHIER_TYPE}`;

export interface CashierParams {
  env: CashierEnv;
  type: CashierType;
  data?: Record<string, any>;
  url?: string;
  redirectURL?: string;
}

export interface CashierOptions {
  WECHAT_SDK_URL?: string;
  ALIPAY_SDK_URL?: string;
  TIKTOK_SDK_URL?: string;
  MICROAPP_PATH?: string;
  resolveURL?: (url?: string) => string;
  resolvePath?: (params: CashierParams, options: CashierOptions) => string;
}

export interface CashierClassType {
  params: CashierParams;
  options: CashierOptions;
  strategy?: CashierStrategyClass;
  load?(): void;
  request(): void;
}

export interface CashierStrategyClass {
  new (
    params: CashierParams,
    options?: CashierOptions,
  ): CashierStrategyClassType;
}

export interface CashierStrategyClassType {
  load?(): void;
  validate?(): void;
  request(): void;
}
