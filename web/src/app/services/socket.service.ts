import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { SocketConfig } from './../interfaces/socket-config';

@Injectable()
export class SocketService {
  private INIT_FUNC: string = "init";
  private config: SocketConfig;
  private attempts: number = 0;
  private socket: any;

  private _handler: any = false;
  private _callback: any;
  private _observer: any;

  private _onMessageBag: any = [];

  status:number = 1;
  error:string  = null;

  createSocket(config): Observable<SocketService> {
    let _this = this;
    this.config = config;

    return Observable.create((observer) => {
      _this._observer = observer;

      if(_this.config.priority == "handler" && _this.config.handler != false) {
        return _this._byHandler();
      }

      _this._createSocket();
    });
  }

  createData(id, data) {
    let arr = {
      id: id,
      data: data
    };
  }

  on(id, callback): void {
    this._onMessageBag.push({id: id, callback: callback});
  }

  emit(data): void {
    this.socket.send(data);
  }

  private _byHandler(): void {
    var _this = this;

    this._initHandler((socketHandler) => {
      _this._handler = socketHandler;
      _this._buildConfig();
      _this._createSocket();
    });
  }

  private _buildConfig(): void {
    let config = this._handler.getConfig();
    for(let k in config) {
      this.config[k] = config[k];
    }
  }

  private _createSocket(): void {
    let url = this._getUrl();

    this.socket = new WebSocket(url);
    this._checkConnection();
    this._callHandler(this.INIT_FUNC);
    this._eventListener();

    this._observer.next(this);
    this._observer.complete();
  }

  private _getUrl() {
    return this.config.url + ":" + this.config.port;
  }

  private _checkConnection(): void {
    var _this = this;

    this.socket.onerror = (err) => {
      if(!_this.config.reconnection || _this.attempts >= _this.config.reconnectionAttempts) {
        return _this._handleError(err);
      }

      _this.status = 2;
      _this.attempts++;
    };
  }

  private _handleError(err): void {
    this.status = 0;
    this.error  = err;
  }

  private _initHandler(callback): void {
    let _this   = this,
        handler = this.config.handler,
        path    = "./app/handlers/socket/" + handler + "/" + handler + ".handler";

    System.import(path).then((ref) => {
      if(typeof ref != "object") {
        _this._observer.error(new Error('Internal error, please checkout your config.json or report!'));
      }

      let keys = Object.keys(ref);
      if(keys.length < 1) {
        _this._observer.error(new Error('The specified handler isn\'t properly working, please check out your config.json'));
      }

      let handlerClass = keys[0],
          handler = new ref[handlerClass]();

      callback(handler);
    });
  }

  private _callHandler(method): void {
    if(this.config.handler == false) {
      return;
    }

    if(this._handler == false) {
      let _this = this;

      _this._initHandler((socketHandler) => {
        _this._handler = socketHandler;
        _this._callHandler(method);
      });
    }

    this._handler[method](this);
  }

  private _eventListener(): void {
    let _this = this;

    //DEBUG
    this.socket.onopen = (data) => {
      console.log("CONNECTED TO : " + _this._getUrl());
    };

    this.socket.onmessage = (e) => {
      _this._onMessage(e);
    };
  }

  private _onMessage(e) {
    let data = JSON.parse(e.data),
        lgt = this._onMessageBag.length;

    for(var i = 0; i < lgt; i++) {
      let id = this._onMessageBag[i].id;

      if(id == false) {
        this._onMessageBag[i].callback(data);
        continue;
      }

      if(data.$type.indexOf(id) > -1) {
        this._onMessageBag[i].callback(data);
      }
    }
  }
}
