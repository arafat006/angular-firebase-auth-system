import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { FormValidationCustomModel } from 'src/app/shared/models/form-validation-custom-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseErrorNormalizeService } from 'src/app/shared/services/firebase/firebase-error-normalize.service';
import { FormErrorNormalizeService } from 'src/app/shared/services/form-error-normalize.service';
import { NgToastService } from 'ng-angular-popup';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';
import { Observable } from 'rxjs';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
  signupForm: any;
  formSubmittedOnce: boolean = false;
  config = {
    animation: true,
    backdrop: true,
    data: {
      title: 'Custom Title',
      message: 'Custom Message',
      modalType: ModalPopupType.Default,
    },
    ignoreBackdropClick: false,
    keyboard: false,
    show: true,
    modalClass: 'modal-dialog-centered modal-md'
  };

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public formErrorNormalizeService: FormErrorNormalizeService,
    public firebaseErrorNormalizeService: FirebaseErrorNormalizeService,
    private modalService: MdbModalService,
    private loadingHelperService: LoadingHelperService)
    { }

  ngOnInit(): void {
    this.buildSigninForm();
    this.loadingHelperService.removeLoadingOverlay();
  }

  buildSigninForm(): void{
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  openModal(title: string, message: string, modalType: ModalPopupType, redirectTo: string | null = null) {
    this.loadingHelperService.addLoadingOverlay();
    this.modalRef = this.modalService.open(PopupMessageComponent, new PopupConfig(title, message, modalType));
    this.modalRef.onClose.subscribe(() => { 
      this.loadingHelperService.removeLoadingOverlay();
      if (redirectTo) {
        this.router.navigate([redirectTo]);
      }
    }); 
  }

  onSubmit(): void{

    if(!this.formSubmittedOnce) {
      this.formSubmittedOnce = true;
    }

    if (!this.signupForm.valid) {
      this.checkFormErrors(this.signupForm.controls);
      return;
    }

    this.authService.SignUp(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name).then(
      () => {
        this.openModal(ModalPopupType.Success, "Account has been created successfully", ModalPopupType.Success, 'verify-email-address');
      },
      error => {
        this.openModal(ModalPopupType.Error, this.firebaseErrorNormalizeService.get(error.code), ModalPopupType.Error);
      }
    );
  }

  checkFormErrors(formControls: FormControl[]) {
    const formControlsWithField = Object.entries<FormControl>(formControls);
    formControlsWithField.forEach( formControl => {
      const fieldName = formControl[0];
      const fieldError = Object.keys(formControl[1].errors ?? '').at(0) ?? null;
      const inputParentElement: any = document.querySelector<HTMLElement>(`[formControlName='${fieldName}']`)?.parentElement;
      if(inputParentElement?.previousElementSibling && fieldError){
        inputParentElement.classList.add('error-border');
        inputParentElement.previousElementSibling.hidden = false;
        inputParentElement.previousElementSibling.innerText = this.formErrorNormalizeService.get(fieldName, fieldError) ?? '';
        return;
      }

      inputParentElement.classList.remove('error-border');
      inputParentElement.previousElementSibling.hidden = true;
    });
  }

  // showSuccess() {
  //   this.toastr.error('everything is broken', 'Major Error', {
  //     timeOut: 3000,
  //   });
  // }

  checkFieldValidationOnChange(formControls: any, event: any) {
    const inputParentElement = event.target.parentNode;
    if (!this.formSubmittedOnce) {
      inputParentElement.previousSibling.hidden = true;
      inputParentElement.classList.remove('error-border');
      return;
    }

    const currentFieldError = this.getCurrentFieldError(formControls, event);
    if (currentFieldError?.errorType) {
      inputParentElement.classList.add('error-border');
      inputParentElement.previousSibling.hidden = false;
      inputParentElement.previousSibling.innerText = currentFieldError.normalizedError;
      return;
    }

    inputParentElement.classList.remove('error-border');
    inputParentElement.previousSibling.hidden = true;
  }

  getCurrentFieldError(formControls: any, event: any): FormValidationCustomModel | null {
    const currentField = event.target.getAttribute('formControlName');
    let formErrors = Object.entries<FormControl>(formControls);

    for (let i = 0; i < formErrors.length; i++) {
      const field: string = formErrors.at(i)?.at(0)?.toString() ?? '';
      if (field === currentField) {
        const fieldError = Object.keys((formErrors.at(i)?.at(1) as FormControl).errors ?? '').at(0) ?? null;
        return { 
          valid: false,
          field: field, 
          errorType: fieldError,
          normalizedError: this.formErrorNormalizeService.get(field, fieldError),
        } as FormValidationCustomModel;
      }
    }

    return null;
  }
}
