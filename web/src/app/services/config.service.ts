import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Config } from './../interfaces/config';

@Injectable()
export class ConfigService {
  private url: string = './../../config/config.json';
  private _default: Config = {
    username: "username",
    lat: 0,
    lng: 0,
    zoom: 7,
    socket: {
      priority: "config",
      handler: false,
      url: "http://localhost",
      port: 5000,
      reconnection: false,
      reconnectionAttempts: 2
    }
  };
  private errors = [];

  constructor(private http:Http) {}

  getConfig(): Observable<Config> {
    let self = this;

    return this.http.get(this.url)
    .map((res) => self._extractData(res))
    .catch(this._handleError);
  }

  private _extractData(res: Response) {
    res = this._checkConfig(res.json());

    return res;
  }

  private _checkConfig(res) {
    let keys = Object.keys(this._default),
        lgt = keys.length;

    for(var i = 0; i < lgt; i++) {
      let k = keys[i];

      if(typeof res[k] == "undefined" || res[k] == null) {
        res[k] = this._default[k];
        this.errors.push(k);
      }
    }

    return res;
  }

  private _handleError(error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);

    return Observable.throw(errMsg);
  }

  public getErrors() {
    let e = this.errors.length;
    this.errors = [];

    return e;
  }
}
