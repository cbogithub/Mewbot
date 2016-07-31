import { Injectable } from '@angular/core';

import { SocketConfig } from './../interfaces/socket-config';
import * as io from 'socket.io-client'

@Injectable()
export class SocketService {
  private config: SocketConfig;
  private socket;
  private attempts:number = 0;
  status:number = 1;
  error         = null;

  createSocket(config) {
    this.config = config;

    let url = this._getUrl();
    let self = this;

    this.socket = io.connect(url, {reconnection: config.reconnection, reconnectionAttempts: config.reconnectionAttempts});
    this.socket.on('connect_error', (err) => {
      if(!self.config.reconnection || self.attempts >= self.config.reconnectionAttempts) {
        return self._handleError(err);
      }

      self.status = 2;
      self.attempts++;
    });
    this._eventListener();

    return this.socket;
  }

  add(id, callback) {
    this.socket.on(id, callback);
  }

  private _getUrl() {
    return this.config.url + this.config.port;
  }

  private _eventListener() {
    this.socket.on('connection', (data) => {
      console.log(data);
    })
  }

  private _handleError(err) {
    this.status = 0;
    this.error  = err;
  }
}
