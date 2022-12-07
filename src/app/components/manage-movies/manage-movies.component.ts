import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { timeout } from 'rxjs';
import { FirestoreCollection } from 'src/app/shared/enums/firestore-collection';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreCollectionManagementService } from 'src/app/shared/services/firestore/firestore-collection-management.service';
import { FirestoreMoviesService } from 'src/app/shared/services/firestore/firestore-movies.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';
import { MiscellaneousService } from 'src/app/shared/services/miscellaneous/miscellaneous.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-movies',
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.css']
})
export class ManageMoviesComponent implements OnInit {

  public movies: FirestoreMovie[] = [];

  constructor(public authService: AuthService, 
    public firestoreCollectionManagementService: FirestoreCollectionManagementService, 
    public loadingHelperService: LoadingHelperService, 
    public firestoreService: FirestoreService,
    public miscellaneousService: MiscellaneousService) { }

  ngOnInit(): void {
    this.getMoviesUploadedByUid();
  }

  async getMoviesUploadedByUid() {
    this.authService.authPromise.then(async () => {
      this.movies = await this.firestoreCollectionManagementService.getAllByUploader(FirestoreCollection.Movie, this.authService.userData.uid) as FirestoreMovie[];
      this.loadingHelperService.removeLoadingOverlay();
      console.log(this.movies);
    }, () => {});
  }

  deleteConfirmation(uid: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.firestoreCollectionManagementService.delete(FirestoreCollection.Movie, uid).then(() => {
          Swal.fire('Removed!', 'item removed successfully.', 'success');
          this.getMoviesUploadedByUid();
        }).catch(() => {
          Swal.fire('Error!', 'Please try again.', 'error');
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'item still in database.', 'error');
      }
    });
  }
}
