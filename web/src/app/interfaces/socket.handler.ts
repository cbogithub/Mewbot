import { SocketHandlerConfig } from './socket-handler-config';

export interface SocketHandler {
  init(socket: any): void;
  getConfig(): SocketHandlerConfig;
}
