import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
  categoryList = this.fixSortAlphabetThenNumber(Object.values(CategoryEnum).sort());
  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
  categoryMultiselectSettings: IDropdownSettings = {};
  releaseYearMultiselectSettings: IDropdownSettings = {};
  yearList: number[] = this.getYearList(1800, new Date().getFullYear()).sort((a, b) => b - a);

  constructor(public authService: AuthService,
    public firestoreService: FirestoreService, 
    public loadingHelperService: LoadingHelperService, 
    public firestoreMoviesService: FirestoreMoviesService,
    public formBuilder: FormBuilder,
    private modalService: MdbModalService) { }

  ngOnInit(): void {

    this.categoryMultiselectSettings = {
      allowSearchFilter: true,
      searchPlaceholderText: 'Search Genre'
    };

    this.releaseYearMultiselectSettings = {
      allowSearchFilter: true,
      searchPlaceholderText: 'Search Year',
      singleSelection: true,
    };

    this.loadingHelperService.removeLoadingOverlay();
    this.buildAddMovieForm();
  }

  fixSortAlphabetThenNumber(list: string[]) {
    for (let i = 0; i < list.length; i++) {
      if ('0' <= list[i][0] && list[i][0] <= '9') {
        let item = list.shift();
        if (item) {
          list.push(item);
        }
      }
      else {
        break;
      }
    }

    return list;
  }

  getYearList(min: number, max: number) {
    let yearList = [];
    for(min; min <= max; min++) {
      yearList.push(min);
    }
    return yearList;
  }

  buildAddMovieForm(): void {
    this.movieForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      genre: [[], [Validators.required]],
      imgUrl: ['', [Validators.required]],
      videoUrl: ['', [Validators.required, Validators.minLength(1)]],
      releasedYear: [null, [Validators.required]],
      uploadedByUid: [this.authService.userData.uid, [Validators.required]],
      uploadedDate: [new Date().toUTCString()],
      private: [BooleanEnum.true, [Validators.required]]
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
    this.movieForm.value.uploadedDate = new Date();
    this.movieForm.value.releasedYear = this.movieForm.value.releasedYear[0];

    if(this.movieForm.valid) { 
      this.firestoreMoviesService.addMovie(this.movieForm.value).then(() => {
        this.openModal(ModalPopupType.Success, "Added Successfully", ModalPopupType.Success, true);
      }).catch(() => {
        this.openModal(ModalPopupType.Error, "Error while Adding", ModalPopupType.Error);
      });
    }
  }
}
