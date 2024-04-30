import { AbstractCashier } from '../../abstract';
import { CASHIER_ENV } from '../../types';
import { BrowserCashierSignStrategy } from './browser';
import {
  AlipayMiniProgramCashierSignStrategy,
  WechatMiniProgramCashierSignStrategy,
} from './mini-program';

export class CashierSign extends AbstractCashier {
  load() {
    switch (this.params.env) {
      case CASHIER_ENV.WECHAT_MINIPROGRAM:
        this.strategy = WechatMiniProgramCashierSignStrategy;
        break;
      case CASHIER_ENV.ALIPAY_MINIPROGRAM:
        this.strategy = AlipayMiniProgramCashierSignStrategy;
        break;
      default:
        this.strategy = BrowserCashierSignStrategy;
        break;
    }
  }
}
