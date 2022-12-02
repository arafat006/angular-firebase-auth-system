import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { BooleanEnum } from 'src/app/shared/enums/boolean.enum';
import { CategoryEnum } from 'src/app/shared/enums/category.enum';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreMoviesService } from 'src/app/shared/services/firestore/firestore-movies.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  
  movieForm: any;
  booleanEnumList = Object.values(BooleanEnum);
  modalRef: MdbModalRef<PopupMessageComponent> | null = null;

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: any = {};

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  
  constructor(public authService: AuthService,
    public firestoreService: FirestoreService, 
    public loadingHelperService: LoadingHelperService, 
    public firestoreMoviesService: FirestoreMoviesService,
    public formBuilder: FormBuilder,
    private modalService: MdbModalService) { }

  ngOnInit(): void {

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.loadingHelperService.removeLoadingOverlay();
    this.buildAddMovieForm();
  }

  buildAddMovieForm(): void {
    this.movieForm = this.formBuilder.group({
      title: ['Test Movie 1', [Validators.required, Validators.minLength(1)]],
      url: ['link123', [Validators.required]],
      category: [[CategoryEnum.Survival], [Validators.required]],
      uploadedByUid: [this.authService.userData.uid, [Validators.required]],
      uploadedDate: [''],
      published: [BooleanEnum.true, [Validators.required]],
      private: [BooleanEnum.false, [Validators.required]],
    });
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

  onSubmit() {
    console.log(this.movieForm.value);
    console.log(this.movieForm.valid);

    if(this.movieForm.valid) { 
      this.firestoreMoviesService.addMovie(this.movieForm.value).then(() => {
        this.openModal(ModalPopupType.Success, "Added Successfully", ModalPopupType.Success, true);
      }).catch(() => {
        this.openModal(ModalPopupType.Error, "Error while Adding", ModalPopupType.Error);
      });
    }
  }
}
