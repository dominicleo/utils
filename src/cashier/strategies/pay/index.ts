import { AbstractCashier } from '../../abstract';
import { CASHIER_ENV } from '../../types';
import { BrowserCashierPayStrategy } from './browser';
import {
  AlipayMiniProgramCashierPayStrategy,
  TiktokMiniProgramCashierPayStrategy,
  WechatMiniProgramCashierPayStrategy,
} from './mini-program';

export class CashierPay extends AbstractCashier {
  load() {
    switch (this.params.env) {
      case CASHIER_ENV.WECHAT_MINIPROGRAM:
        this.strategy = WechatMiniProgramCashierPayStrategy;
        break;
      case CASHIER_ENV.ALIPAY_MINIPROGRAM:
        this.strategy = AlipayMiniProgramCashierPayStrategy;
        break;
      case CASHIER_ENV.TIKTOK_MINIPROGRAM:
        this.strategy = TiktokMiniProgramCashierPayStrategy;
        break;
      default:
        this.strategy = BrowserCashierPayStrategy;
        break;
    }
  }
}
