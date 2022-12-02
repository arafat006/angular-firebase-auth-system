import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import { Role } from 'src/app/shared/enums/role';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { FirestoreUser } from 'src/app/shared/models/firestore-user';
import { FirestoreUsersService } from 'src/app/shared/services/firestore/firestore-users.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  uid: string | null = null;
  user: FirestoreUser | null = null;
  isLoading: boolean = true;
  userRoles = Object.values(Role);
  userForm: any;

  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
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
  
  constructor(public loadingHelperService: LoadingHelperService, 
    public formBuilder: FormBuilder, 
    public route: ActivatedRoute, 
    public firestoreUsersService: FirestoreUsersService,
    private modalService: MdbModalService,
    public router: Router) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.uid = params.get('uid');
      
      if (this.uid) {
        this.firestoreUsersService.getUser(this.uid).subscribe(docSnap => {
          if (docSnap.exists) {
            this.user = docSnap.data() as FirestoreUser;
            if (!this.user.role) {
              this.user.role = Role.User;
            }
            if (!this.user.tenantId) {
              this.user.tenantId = '';
            }

            this.buildSigninForm(this.user);
          } else {
            this.user = null;
          }

          this.afterGettingUserData();
        });
      } else {
        this.user = null;
        this.afterGettingUserData();
      }
    })
  }

  buildSigninForm(user: FirestoreUser): void{
    this.userForm = this.formBuilder.group({
      uid: [{value: user.uid, disabled: true}],
      email: [{value: user.email, disabled: true}],
      displayName: [{value: user.displayName, disabled: true}],
      photoURL: [{value: user.photoURL, disabled: true}],
      emailVerified: [{value: user.emailVerified, disabled: true}],
      tenantId: [{value: user.tenantId, disabled: false}],
      role: [{value: user.role, disabled: false}],
      isDisabled: [{value: user.isDisabled ?? false , disabled: true}],
    });
  }

  afterGettingUserData() {
    this.isLoading = false;
    this.loadingHelperService.removeLoadingOverlay();
  }

  onSubmit() {
    if(this.user) {
      this.user.tenantId = this.userForm.controls.tenantId.value;
      this.user.role = this.userForm.controls.role.value;

      this.firestoreUsersService.updateUser(this.user.uid, this.user).then(result => {
        this.openModal(ModalPopupType.Success, "Updated Successfully", ModalPopupType.Success, true);
      }).catch(error => {
        this.openModal(ModalPopupType.Error, "Error while updating", ModalPopupType.Error);
      })
    }
  }

  openModal(title: string, message: string, modalType: ModalPopupType, reload: boolean = false) {
    this.loadingHelperService.addLoadingOverlay();
    this.modalRef = this.modalService.open(PopupMessageComponent, new PopupConfig(title, message, modalType));
    this.modalRef.onClose.subscribe(() => { 
      this.loadingHelperService.removeLoadingOverlay();
      if (reload) {
        window.location.reload();
      }
    }); 
  }
}
