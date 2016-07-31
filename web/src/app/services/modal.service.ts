import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ModalService {
  private errorModal = new Subject<any>();
  private allSource  = {
    error: this.errorModal
  };

  callError$ = this.errorModal.asObservable();

  call(id, config) {
    this.allSource[id].next(config);
  }
}
