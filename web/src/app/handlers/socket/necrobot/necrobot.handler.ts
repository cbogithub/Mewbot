import { Injectable } from '@angular/core';

@Injectable()
export class NecrobotHandler {
  private config = {
    port: 14251,
    url: "wss://127.0.0.1"
  }
  private socket;

  constructor() {}

  init(socket) {
    this.socket = socket;
    this._eventListener();
  }

  getConfig(config) {
    for(let k in this.config) {
      config[k] = this.config[k];
    }

    return config;
  }

  private _eventListener() {
    this.socket.on("PokeStopList", this._pokeStopList);
  }

  private _pokeStopList(e) {
    console.log(e);
  }
}
