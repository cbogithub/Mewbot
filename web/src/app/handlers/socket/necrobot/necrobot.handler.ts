import { Injectable } from '@angular/core';

import { SocketHandler } from './../../../interfaces/socket.handler';
import { SocketHandlerConfig } from './../../../interfaces/socket-handler-config';

@Injectable()
export class NecrobotHandler implements SocketHandler {
  private config: SocketHandlerConfig = {
    port: 14251,
    url: "wss://127.0.0.1"
  }
  private socket;

  constructor() {}

  init(socket): void {
    this.socket = socket;
    this._eventListener();
  }

  getConfig(): SocketHandlerConfig {
    return this.config;
  }

  private _eventListener(): void {
    this.socket.on("PokeStopList", this._pokeStopList);
  }

  private _pokeStopList(e) {
    console.log(e);
  }
}
