import { Injectable } from '@angular/core';
import {Inject} from '@angular/core';

import { SocketHandler } from './../../../interfaces/socket.handler';
import { SocketHandlerConfig } from './../../../interfaces/socket-handler-config';

import { MapService } from './../../../services/map.service';

@Injectable()
export class NecrobotHandler implements SocketHandler {
  private config: SocketHandlerConfig = {
    port: 14251,
    url: "wss://127.0.0.1"
  };
  private socket;
  private map_service;
  private M_PLAYER: string = "necrobot_player";

  constructor(socket, map_service: MapService) {
    this.socket = socket;
    this.map_service = map_service;
    this._eventListener();
  }

  getConfig(): SocketHandlerConfig {
    return this.config;
  }

  private _eventListener(): void {
    let _this = this;
    this.socket.on("PokeStopList", (e) => _this._pokeStopList(e));
    this.socket.on("UpdatePosition", (e) => _this._updatePosition(e));
  }

  private _pokeStopList(e) {
    console.log(e);
  }

  private _updatePosition(e) {
    let marker = {
      coords: {
        lat: e.Latitude,
        lng: e.Longitude
      },
      iconUrl: 'img/dresser.png'
    };

    this.map_service.editMarker(this.M_PLAYER, 0, marker);
    this.map_service.setCenter(e.Latitude, e.Longitude);
  }
}
