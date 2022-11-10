import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseErrorNormalizeService } from 'src/app/shared/services/firebase/firebase-error-normalize.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginForm: any;
  errorMessage: string | null = null;
  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
  formSubmittedOnce: boolean = false;
  
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public loadingHelperService: LoadingHelperService,
    private modalService: MdbModalService,
    public firebaseErrorNormalizeService: FirebaseErrorNormalizeService
    ) { }

  ngOnInit(): void {
    this.buildLoginForm();
    this.loadingHelperService.removeLoadingOverlay();
  }

  buildLoginForm(): void{
    this.loginForm = this.formBuilder.group({
      email: ['arafathossainarafat6@gmail.com', [Validators.email, Validators.required]],
      password: ['123456', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onComplete() {
  //   console.log('Completed', 'Process Completed');
  // }

  // onError(errorResponse: HttpErrorResponse) {

  //   if (errorResponse.status === 401) {
  //     this.errorMessage = 'User is ' + errorResponse.error.toLowerCase();
  //   } 
  //   else {
  //     this.errorMessage = 'Something went wrong';
  //   }
  // }

  // onSaveComplete() {
  //   console.log('Saved successfully', 'Success');
  // }

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
    if (this.loginForm.invalid){
      return;
    }

    this.loadingHelperService.addLoadingOverlay();
    this.authService.SignIn(this.loginForm.value.email, this.loginForm.value.password).then(()=>{
      this.loadingHelperService.addLoadingOverlay();
    }, error => {
      const errorMessage = this.firebaseErrorNormalizeService.get(error.code);
      this.openModal(ModalPopupType.Error, errorMessage, ModalPopupType.Error);
    });
  }
}
