import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ModalPopupType } from '../../enums/modal-popup-type.enum';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})

export class PopupMessageComponent implements OnInit {
  
  title: string | null = "Title";
  message: string | null = "Message";
  modalType: ModalPopupType = ModalPopupType.Default;

  constructor(public modalRef: MdbModalRef<PopupMessageComponent>) {
    
  }

  ngOnInit(): void {

  }

  getBgClass(modalType: string): string {
    switch(modalType) {
      case ModalPopupType.Success: return 'bg-success-custom';
      case ModalPopupType.Info: return 'bg-info-custom';
      case ModalPopupType.Warning: return 'bg-warning-custom';
      case ModalPopupType.Error: return 'bg-danger-custom';
      default: return 'bg-default-custom';
    }
  }

  getIconClass(modalType: string): string {
    switch(modalType) {
      case ModalPopupType.Success: return 'fa-check-circle';
      case ModalPopupType.Info: return 'fa-info-circle';
      case ModalPopupType.Warning: return 'fa-exclamation-triangle';
      case ModalPopupType.Error: return 'fa-exclamation-circle';
      default: return 'fa-cog';
    }
  }

  close(): void {
    this.modalRef.close();
  }
}