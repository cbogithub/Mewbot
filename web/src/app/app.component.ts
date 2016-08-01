import { Component, Input } from '@angular/core';
import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

import {ErrorModal} from './components/modals/error/error.component';

import { Config } from './interfaces/config';

import { ConfigService } from './services/config.service';
import { SocketService } from './services/socket.service';
import { ModalService } from './services/modal.service';
import { MapService } from './services/map.service';

import {KeysPipe} from './pipes/keys.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [GOOGLE_MAPS_DIRECTIVES, ErrorModal],
  providers: [ConfigService, SocketService, ModalService, MapService],
  pipes: [KeysPipe]
})

export class AppComponent {
  @Input()
  config:  Config;
  SOCKET = null;

  constructor(private config_service: ConfigService,
    private socket_service: SocketService,
    private modal_service: ModalService,
    private map_service: MapService) {
    let _this = this;
    this.config_service.getConfig().subscribe(config => {
      _this._ready(config)
    });
  }

  private _ready(config) {
    let _this = this;
    this.config = <Config>config;
    this.socket_service.createSocket(this.config.socket).subscribe((s) => {_this._initSocket(s) }, (e) => { _this._handleError(e) });

    if(this.config_service.getErrors()) {
      let config = {action: 1, text: false, content: true, button: {type: "success", text: "Start"}};
      this.modal_service.call("error", config);
    }
  }

  private _initSocket(socket) {
    this.SOCKET = socket;
  }

  private _handleError(err) {
    let config = this.modal_service.buildConfig({text: err, content: false});
    this.modal_service.call("error", config);
  }

  run() {
    if(!this.map_service.markers.length) {
      let config = {action: 1, text: "Please add waypoints before starting !", content: false, button: {type: "danger", text: "Close"}};
      this.modal_service.call("error", config);

      return;
    }

    var json = JSON.stringify(this.map_service.markers);
    this.SOCKET.emit("submit", json)
  }

  isObject(val) {
    return typeof val == "object";
  }

  normalize(e) {
    return parseFloat(e);
  }

  getColor() {
    if(this.socket_service.status == 0) {
      return "red";
    } else if (this.socket_service.status == 1) {
      return "green";
    } else {
      return "orange";
    }
  }

  toJson(obj) {
    return JSON.stringify(obj, null, '\t');
  }

  updateCoords(e) {
    this.config.lat = e.lat;
    this.config.lng = e.lng;
  }
}
