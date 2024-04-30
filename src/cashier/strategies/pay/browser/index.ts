import { AbstractCashierStrategy, CashierError } from '../../../abstract';

export class BrowserCashierPayStrategy extends AbstractCashierStrategy {
  request() {
    const url = this.options.resolveURL
      ? this.options.resolveURL(this.params.url)
      : this.params.url;

    if (!url) {
      return Promise.reject(new CashierError('Payment URL is empty'));
    }

    if (this.params.redirectURL) {
      window.history.replaceState({}, '', this.params.redirectURL!);
      window.location.replace(url);
      return;
    }

    window.location.href = url;
  }
}
