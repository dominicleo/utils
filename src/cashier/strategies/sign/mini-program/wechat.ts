import { isBoolean, isEmptyObject, isPlainObject } from '../../../../validate';
import { AbstractCashierStrategy, CashierError } from '../../../abstract';
import { loadScript } from '../../../utils';

export class WechatMiniProgramCashierSignStrategy extends AbstractCashierStrategy {
  async load() {
    if (!this.options.ALIPAY_SDK_URL) {
      return Promise.reject(new CashierError('Wechat JSSDK URL is empty'));
    }

    try {
      await loadScript(this.options.ALIPAY_SDK_URL);
      if (!('wx' in window)) throw new Error();
    } catch {
      return Promise.reject(new CashierError('Wechat JSSDK failed to load'));
    }
  }
  validate() {
    if (!isPlainObject(this.params.data) || isEmptyObject(this.params.data)) {
      return Promise.reject(
        new CashierError('Wechat sign data cannot be empty'),
      );
    }
  }
  request() {
    const path = this.options.resolvePath?.(this.params, this.options);

    if (!path) {
      return Promise.reject(
        new CashierError('Wechat mini program path is empty'),
      );
    }

    let done: boolean;
    wx.miniProgram.navigateTo({
      url: path,
      success: () => {
        if (!this.params.redirectURL) return;
        if (!WeixinJSBridge) {
          return console.error('未找到 WeixinJSBridge');
        }
        WeixinJSBridge?.on(
          'onPageStateChange',
          (response: Record<string, any>) => {
            const active = isBoolean(response.active)
              ? response.active
              : response.active === 'true';
            if (!done && active) {
              done = true;
              window.location.replace(this.params.redirectURL!);
            }
          },
        );
        // 部分设备不会触发 onPageStateChange
        document.addEventListener('visibilitychange', () => {
          if (!done && document.visibilityState === 'visible') {
            done = true;
            window.location.replace(this.params.redirectURL!);
          }
        });
      },
    });
  }
}
