import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ModalService {
  private errorModal = new Subject<any>();
  private allSource  = {
    error: this.errorModal
  };
  private defaultConfig = {
    action: 1,
    text: false,
    content: true,
    button: {
      type: "danger",
      text: "Close"
    }
  };

  callError$ = this.errorModal.asObservable();

  buildConfig(param) {
    let config = this.defaultConfig;
    return this._rightConfig(config, param);
  }

  _rightConfig(config, param) {
    let keys = Object.keys(param);

    for(let k of keys) {
      if(typeof config[k] == "object") {
        config[k] = this._rightConfig(config[k], param[k]);
        continue;
      }

      config[k] = param[k];
    }

    return config;
  }

  call(id, config) {
    this.allSource[id].next(config);
  }
}
