import { Component } from '@angular/core';
import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client'

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [GOOGLE_MAPS_DIRECTIVES]
})

export class AppComponent {
  config = {
    username: null,
    lat: 0,
    lng: 7.809007
  }

  markers = []

  SOCKET     = null;
  SOCKET_URL = "http://localhost:5000";

  constructor(private http: Http) {
    this._setup_config();
    this._setup_socket();
  }

  _setup_config() {
    this.http.get('./config/config.json').subscribe((res) => {
        this.config = res.json();
        this._ready();
    });
  }

  _setup_socket() {
    this.SOCKET = io(this.SOCKET_URL);

    this.SOCKET.on("test", (msg) => {
      console.log(msg);
    });
  }

  _ready() {
    //alert("Choose endpoint(s)");
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
  }

  submit() {
    var lgt = this.markers.length;

    if(lgt < 1) {
      alert("Please enter endpoints");
      return;
    }


  }

  reset() {
    this.SOCKET.emit("message", "hello");
    this.markers = [];
  }
}
