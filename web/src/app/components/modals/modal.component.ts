import { Component, Input, Output, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'modal',
  templateUrl: './app/components/modals/modal.component.html',
  styleUrls: ['./app/components/modals/modal.component.css']
})

export class Modal implements AfterViewInit {
    @Input() title:string;
    @Input() showClose:boolean = true;
    @Input() class:string;
    @Output() onClose: EventEmitter<any> = new EventEmitter();

    modalEl = null;
    id: string = uniqueId('modal_');

    constructor(private _rootNode: ElementRef) {}

    open() {
        this.modalEl.modal('show');
    }

    close() {
        this.modalEl.modal('hide');
    }

    closeInternal() { // close modal when click on times button in up-right corner
        this.onClose.next(null); // emit event
        this.close();
    }

    ngAfterViewInit() {
        this.modalEl = $(this._rootNode.nativeElement).find('div.modal');
    }

    has(selector) {
        return $(this._rootNode.nativeElement).find(selector).length;
    }
}

let modal_id: number = 0;
export function uniqueId(prefix: string): string {
    return prefix + ++modal_id;
}
