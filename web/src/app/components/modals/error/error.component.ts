import { Component } from '@angular/core';

import { Modal } from './../modal.component';
import { ModalService } from './../../../services/modal.service';

@Component({
  selector: 'error-modal',
  templateUrl: './app/components/modals/error/error.component.html',
  directives: [Modal]
})

export class ErrorModal {
  _modal  = null;
  _config = {};

  constructor(private modal_service: ModalService) {
    let self = this;

    modal_service.callError$.subscribe((config) => {
      self._config = config;
      if(config.action == 1) {
        return self.open();
      }

      self.close();
    });
  }

  bindModal(modal) {
    this._modal = modal;
  }

  open() {
    if(!this._modal)
      return;

    this._modal.open();
  }

  close() {
      this._modal.close();
  }
}
