import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { FormValidationCustomModel } from 'src/app/shared/models/form-validation-custom-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseErrorNormalizeService } from 'src/app/shared/services/firebase/firebase-error-normalize.service';
import { FormErrorNormalizeService } from 'src/app/shared/services/form-error-normalize.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any;
  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
  formSubmittedOnce: boolean = false;

  constructor(public authService: AuthService, 
    public loadingHelperService: LoadingHelperService,
    private modalService: MdbModalService,
    public firebaseErrorNormalizeService: FirebaseErrorNormalizeService,
    public router: Router,
    private formBuilder: FormBuilder,
    public formErrorNormalizeService: FormErrorNormalizeService)
    { }

  ngOnInit(): void {
    this.buildForgotPasswordForm();
    this.loadingHelperService.removeLoadingOverlay();
  }

  buildForgotPasswordForm(): void{
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  requestForgetPassword(): void {
    this.loadingHelperService.addLoadingOverlay();
    if(!this.formSubmittedOnce) {
      this.formSubmittedOnce = true;
    }

    if (!this.forgotPasswordForm.valid) {
      this.checkFormErrors(this.forgotPasswordForm.controls);
      this.loadingHelperService.removeLoadingOverlay();
      return;
    }

    setTimeout(() => {
      this.authService.ForgotPassword(this.forgotPasswordForm.value.email).then(() => {
        const message = "Password reset email has been sent, please check your inbox. If not found, please check your spam folder"
        this.openModal(ModalPopupType.Success, message, ModalPopupType.Success, 'login');
      }, error => {
        const normalizeErrorMessage = this.firebaseErrorNormalizeService.get(error.code);
        this.openModal(ModalPopupType.Error, normalizeErrorMessage, ModalPopupType.Error);
      });
    }, 2000);
  }

  checkFormErrors(formControls: FormControl[]) {
    const formControlsWithField = Object.entries<FormControl>(formControls);
    formControlsWithField.forEach( formControl => {
      const fieldName = formControl[0];
      const fieldError = Object.keys(formControl[1].errors ?? '').at(0) ?? null;
      const inputParentElement: any = document.querySelector<HTMLElement>(`[formControlName='${fieldName}']`)?.parentElement;
      if(inputParentElement?.previousElementSibling && fieldError){
        inputParentElement.children[0].classList.add('error-border');
        inputParentElement.previousElementSibling.hidden = false;
        inputParentElement.previousElementSibling.innerText = this.formErrorNormalizeService.get(fieldName, fieldError) ?? '';
        return;
      }

      inputParentElement.children[0].classList.remove('error-border');
      inputParentElement.previousElementSibling.hidden = true;
    });
  }

  checkFieldValidationOnChange(formControls: any, event: any) {
    const inputParentElement = event.target.parentNode;
    if (!this.formSubmittedOnce) {
      inputParentElement.previousSibling.hidden = true;
      inputParentElement.children[0].classList.remove('error-border');
      return;
    }

    const currentFieldError = this.getCurrentFieldError(formControls, event);
    if (currentFieldError?.errorType) {
      inputParentElement.children[0].classList.add('error-border');
      inputParentElement.previousSibling.hidden = false;
      inputParentElement.previousSibling.innerText = currentFieldError.normalizedError;
      return;
    }

    inputParentElement.children[0].classList.remove('error-border');
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
}
