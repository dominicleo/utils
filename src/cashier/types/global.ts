export interface WechatJSSDK {
  miniProgram: {
    navigateTo(options: { url: string; success?(): void }): void;
  };
}

export interface AlipayJSSDK {
  navigateTo(options: { url: string; success?(): void }): void;
  onMessage(message: Record<string, any>): void;
}

export interface TiktokJSSDK {
  miniProgram: {
    navigateTo(options: { url: string; success?(): void }): void;
  };
}

interface WeixinJSBridge {
  on(
    eventName: string,
    callback: (response: Record<string, any>) => void,
  ): void;
}

declare global {
  const wx: WechatJSSDK;
  const my: AlipayJSSDK;
  const tt: TiktokJSSDK;
  const WeixinJSBridge: WeixinJSBridge;
}
