import { AbstractCashier } from './abstract';
import { CashierPay, CashierSign } from './strategies';
import { CASHIER_TYPE } from './types';

export class Cashier extends AbstractCashier {
  load() {
    switch (this.params.type) {
      case CASHIER_TYPE.PAY:
        this.strategy = CashierPay;
        break;
      case CASHIER_TYPE.SIGN:
        this.strategy = CashierSign;
        break;
    }
  }
}
