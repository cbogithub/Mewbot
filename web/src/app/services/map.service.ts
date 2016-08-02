import {Injectable} from '@angular/core';

import { Marker } from './../interfaces/marker';

@Injectable()
export class MapService {
  lat: number;
  lng: number;
  markers: any = {
    waypoints: []
  };
  baseUrl: string = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=";

  setCenter(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  addMarker(key, point) {
    if(typeof key == "undefined" || typeof point == "undefined") {
      return;
    }

    this._checkKey(key);
    let marker = this._createMarker(point, key);

    this.markers[key].push(marker);
  }

  editMarker(key, i, point) {
    if(typeof key == "undefined" || typeof i == "undefined" || typeof point == "undefined") {
      return;
    }

    this._checkKey(key);
    let marker = this._createMarker(point, key);

    this.markers[key][i] = marker;
  }

  removeMarker(key, i, type) {
    let self = this;

    if(type == "iterable") {
      this.updateIterable(key, i);
    }

    this.markers[key].splice(i, 1);
  }

  updateIterable(key, i) {
    let _this = this;

    this.markers[key].forEach(function(value, x) {
      if(x > i) {
        _this.markers[key][x].iconUrl = _this._getIconUrl(x--);
      }
    });
  }

  resetMarkers(key) {
    if(typeof key != "undefined") {
      return this.markers[key] = [];
    }

    this.markers = {};
  }

  getMarkersKeys() {
    return Object.keys(this.markers);
  }

  private _createMarker(e, key) {
    let iconUrl = e.iconUrl;
    if(typeof iconUrl == "undefined") {
      iconUrl = this._getIconUrl(this.markers[key].length + 1);
    }

    let marker: Marker = {
      lat: e.coords.lat,
      lng: e.coords.lng,
      label: "A",
      draggable: true,
      iconUrl: iconUrl
    };

    return marker;
  }

  private _getIconUrl(i) {
    let color = "|FF0000|000000";
    return this.baseUrl + i + color;
  }

  private _checkKey(key) {
      if(typeof this.markers[key] == "undefined") {
        this.markers[key] = [];
      }
  }
}
