import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';

import {GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';
import {HTTP_PROVIDERS} from '@angular/http';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  GOOGLE_MAPS_PROVIDERS,
  HTTP_PROVIDERS
]);
