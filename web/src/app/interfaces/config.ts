import { SocketConfig } from './socket-config';

export interface Config {
  username: string;
  lat: number;
  lng: number;
  zoom: number;
  socket: SocketConfig;
};
