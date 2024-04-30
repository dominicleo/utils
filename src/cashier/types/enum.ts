export enum CASHIER_ENV {
  /** 微信 */
  WECHAT = 'wechat',
  /** 微信小程序 */
  WECHAT_MINIPROGRAM = 'miniprogram',
  /** 支付宝 */
  ALIPAY = 'alipay',
  /** 支付宝小程序 */
  ALIPAY_MINIPROGRAM = 'alipayminiprogram',
  /** 抖音 */
  TIKTOK = 'tiktok',
  /** 抖音小程序 */
  TIKTOK_MINIPROGRAM = 'tiktokminiprogram',
  /** 系统浏览器 */
  BROWSER = 'browser',
}

export enum CASHIER_TYPE {
  /** 支付 */
  PAY = 'pay',
  /** 签约 */
  SIGN = 'sign',
}
