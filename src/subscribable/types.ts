export interface CustomEvent<EventData = any, EventContext = any> {
  type: string;
  data?: EventData;
  context?: EventContext;
}

export type CustomEventClass = new (...args: any[]) => any;
