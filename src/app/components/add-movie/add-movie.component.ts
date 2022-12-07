import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BooleanEnum } from 'src/app/shared/enums/boolean.enum';
import { CategoryEnum } from 'src/app/shared/enums/category.enum';
import { FirestoreCollection } from 'src/app/shared/enums/firestore-collection';
import { ModalPopupType } from 'src/app/shared/enums/modal-popup-type.enum';
import PopupConfig from 'src/app/shared/modals/popup-config/popup-config';
import { PopupMessageComponent } from 'src/app/shared/modals/popup-message/popup-message.component';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreCollectionManagementService } from 'src/app/shared/services/firestore/firestore-collection-management.service';
import { FirestoreMoviesService } from 'src/app/shared/services/firestore/firestore-movies.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';
import { MiscellaneousService } from 'src/app/shared/services/miscellaneous/miscellaneous.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  
  movie: FirestoreMovie = {
    uid: '',
    title: '',
    videoUrl: '',
    imgUrl: '',
    genre: [],
    uploadedByUid: '',
    uploadedDate: undefined,
    releasedYear: 0,
    private: true
  };
  movieUid: string | null = null;
  movieForm: any;
  booleanEnumList = Object.values(BooleanEnum);
  categoryList = this.fixSortAlphabetThenNumber(Object.values(CategoryEnum).sort());
  modalRef: MdbModalRef<PopupMessageComponent> | null = null;
  categoryMultiselectSettings: IDropdownSettings = {};
  releaseYearMultiselectSettings: IDropdownSettings = {};
  yearList: number[] = this.getYearList(1800, new Date().getFullYear()).sort((a, b) => b - a);
  booleanList: boolean[] = [true, false];

  constructor(public authService: AuthService,
    public firestoreService: FirestoreService, 
    public loadingHelperService: LoadingHelperService, 
    public firestoreCollectionManagementService: FirestoreCollectionManagementService,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    private modalService: MdbModalService,
    public miscellaneousService: MiscellaneousService) {
      this.buildMovieForm(this.movie);
    }

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

    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.movieUid = params.get('uid');

      this.authService.authPromise.then(async () => {
        if (this.movieUid) {
          let movie = await this.firestoreCollectionManagementService.get(FirestoreCollection.Movie, this.movieUid) as FirestoreMovie;
          
          if (movie.uploadedByUid === this.authService.userData.uid) {
            this.buildMovieForm(movie);
            this.loadingHelperService.removeLoadingOverlay();
          }
          else {
            this.router.navigate(['add-movie']);
          }
          
        } else {
          this.movie.uploadedByUid = this.authService.userData.uid;
          this.buildMovieForm(this.movie);
          this.loadingHelperService.removeLoadingOverlay();
        }
      }, () => { });
    })
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

  buildMovieForm(movie: FirestoreMovie): void {
    this.movieForm = this.formBuilder.group({
      title: [movie.title, [Validators.required, Validators.minLength(1)]],
      genre: [movie.genre, [Validators.required]],
      imgUrl: [movie.imgUrl, [Validators.required]],
      videoUrl: [movie.videoUrl, [Validators.required, Validators.minLength(1)]],
      releasedYear: [movie.releasedYear === 0 ? [] : [movie.releasedYear], [Validators.required]],
      uploadedByUid: [movie.uploadedByUid, [Validators.required]],
      uploadedDate: [movie.uploadedDate],
      private: [movie.private, [Validators.required]]
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
    this.movieForm.value.releasedYear = this.movieForm.value.releasedYear[0];
    console.log(this.movieForm);
    if (this.movieUid) {
      if (this.movieForm.valid) {
        this.firestoreCollectionManagementService.update(FirestoreCollection.Movie, this.movieUid, this.movieForm.value).then(() => {
          this.openModal(ModalPopupType.Success, "Updated Successfully", ModalPopupType.Success, true);
        }).catch(() => {
          this.openModal(ModalPopupType.Error, "Error while Adding", ModalPopupType.Error);
        });
      }
    } else {
      this.movieForm.value.uploadedDate = new Date();
      if (this.movieForm.valid) {
        this.firestoreCollectionManagementService.add(FirestoreCollection.Movie, this.movieForm.value).then(() => {
          this.openModal(ModalPopupType.Success, "Added Successfully", ModalPopupType.Success, true);
        }).catch(() => {
          this.openModal(ModalPopupType.Error, "Error while Adding", ModalPopupType.Error);
        });
      }
    }
  }
}
