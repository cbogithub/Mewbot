import { SocketHandlerConfig } from './socket-handler-config';

export interface SocketHandler {
  getConfig(): SocketHandlerConfig;
}
