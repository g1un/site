export type FadingMessageTypes = 'error' | 'success';

export interface Message {
  text: string;
  type: FadingMessageTypes;
}
