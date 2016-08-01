import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { SocketConfig } from './../interfaces/socket-config';

@Injectable()
export class SocketService {
  private config: SocketConfig;
  private attempts:number = 0;
  private socket;
  private INIT_FUNC: string = "init";

  private _handler: any = false;
  private _callback;
  private _observer;

  status:number = 1;
  error         = null;

  createSocket(config) {
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

  on(id, callback) {
    this.socket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if(data.$type.indexOf(id) > -1) {
        return callback(data);
      }
    }
  }

  emit(data) {
    this.socket.send(data);
  }

  private _byHandler() {
    var _this = this;

    this._initHandler((socketHandler) => {
      _this._handler = socketHandler;
      _this.config   = _this._handler.getConfig(_this.config);
      _this._createSocket();
    });
  }

  private _createSocket() {
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

  private _checkConnection() {
    var _this = this;

    this.socket.onerror = (err) => {
      if(!_this.config.reconnection || _this.attempts >= _this.config.reconnectionAttempts) {
        return _this._handleError(err);
      }

      _this.status = 2;
      _this.attempts++;
    };
  }

  private _handleError(err) {
    this.status = 0;
    this.error  = err;
  }

  private _initHandler(callback) {
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

  private _callHandler(method) {
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

    this._handler[method]();
  }

  private _eventListener() {
    //DEBUG
    this.socket.onopen = (data) => {
      console.log("CONNECTED TO : " + this._getUrl());
    };
  }
}
