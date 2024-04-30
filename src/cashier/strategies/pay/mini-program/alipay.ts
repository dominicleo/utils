import { isEmptyObject, isPlainObject } from '../../../../validate';
import { AbstractCashierStrategy, CashierError } from '../../../abstract';
import { loadScript } from '../../../utils';

export class AlipayMiniProgramCashierPayStrategy extends AbstractCashierStrategy {
  async load() {
    if (!this.options.ALIPAY_SDK_URL) {
      return Promise.reject(new CashierError('Alipay JSSDK URL is empty'));
    }

    try {
      await loadScript(this.options.ALIPAY_SDK_URL);
      if (!('my' in window)) throw new Error();
    } catch {
      return Promise.reject(new CashierError('Alipay JSSDK failed to load'));
    }
  }
  validate() {
    if (!isPlainObject(this.params.data) || isEmptyObject(this.params.data)) {
      return Promise.reject(
        new CashierError('Alipay payment data cannot be empty'),
      );
    }
  }
  request() {
    const path = this.options.resolvePath?.(this.params, this.options);

    if (!path) {
      return Promise.reject(
        new CashierError('Alipay mini program path is empty'),
      );
    }

    my.navigateTo?.({ url: path });
  }
}
