import { isEmptyObject, isPlainObject } from '../../../../validate';
import { AbstractCashierStrategy, CashierError } from '../../../abstract';
import { loadScript } from '../../../utils';

export class WechatMiniProgramCashierPayStrategy extends AbstractCashierStrategy {
  async load() {
    if (!this.options.ALIPAY_SDK_URL) {
      return Promise.reject(new CashierError('Tiktok JSSDK URL is empty'));
    }

    try {
      await loadScript(this.options.ALIPAY_SDK_URL);
      if (!('wx' in window)) throw new Error();
    } catch {
      return Promise.reject(new CashierError('Tiktok JSSDK failed to load'));
    }
  }
  validate() {
    if (!isPlainObject(this.params.data) || isEmptyObject(this.params.data)) {
      return Promise.reject(
        new CashierError('Tiktok payment data cannot be empty'),
      );
    }
  }
  request() {
    const path = this.options.resolvePath?.(this.params, this.options);

    if (!path) {
      return Promise.reject(
        new CashierError('Tiktok mini program path is empty'),
      );
    }

    wx.miniProgram?.navigateTo?.({ url: path });
  }
}
