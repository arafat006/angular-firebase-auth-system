import { ModalPopupType } from "../../enums/modal-popup-type.enum";

export default class PopupConfig {
    
    animation: boolean = true;
    backdrop: boolean = false;
    data = {
        title: "",
        message: "",
        modalType: ModalPopupType.Default,
    };
    ignoreBackdropClick: boolean = false;
    keyboard: boolean = false;
    show: boolean = true;
    modalClass: string = 'modal-dialog-centered modal-md'

    constructor(title: string = "Title", message: string = "Message", modalType: ModalPopupType = ModalPopupType.Default){
        this.data.title = title;
        this.data.message = message;
        this.data.modalType = modalType;
    }
  }