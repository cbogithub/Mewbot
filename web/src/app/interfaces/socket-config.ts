export interface SocketConfig {
  priority: string;
  handler: any;
  url: string;
  port: number;
  reconnection: boolean;
  reconnectionAttempts: number;
}
