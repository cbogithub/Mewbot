import {Injectable} from '@angular/core';

import { Marker } from './../interfaces/marker';

@Injectable()
export class MapService {
  markers: Marker[] = [];
  baseUrl: string = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=";

  private _getIconUrl(i) {
    let color = "|FF0000|000000";
    return this.baseUrl + i + color;
  }

  addMarker(e) {
    let iconUrl = this._getIconUrl(this.markers.length + 1);

    this.markers.push({
      lat: e.coords.lat,
      lng: e.coords.lng,
      label: "A",
      draggable: true,
      iconUrl: iconUrl
    });
  }

  removeMarker(i) {
    let self = this;

    this.markers.forEach(function(value, x) {
      if(x > i) {
        self.markers[x].iconUrl = self._getIconUrl(x--);
      }
    });

    this.markers.splice(i, 1);
  }

  resetMarkers() {
    this.markers = [];
  }
}
