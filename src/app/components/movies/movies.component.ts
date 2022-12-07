import { Component, OnInit } from '@angular/core';
import { FirestoreCollection } from 'src/app/shared/enums/firestore-collection';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { FirestoreUploader } from 'src/app/shared/models/firestore-uploader';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreCollectionManagementService } from 'src/app/shared/services/firestore/firestore-collection-management.service';
import { FirestoreMoviesService } from 'src/app/shared/services/firestore/firestore-movies.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  public movies: FirestoreMovie[] = [];
  public uploaders: FirestoreUploader[] = [];
  public userUid: string | null = null;

  constructor(public firestoreCollectionManagementService: FirestoreCollectionManagementService, 
    public loadingHelperService: LoadingHelperService, 
    public authService: AuthService,
    public firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.authService.authPromise.then(() => {
      this.userUid = this.authService.userData.uid;
      this.getMovies(this.authService.userData.uid);
    }, () => {});
  }

  async getMovies(userUid: string) {
    this.movies = await this.firestoreCollectionManagementService.getAllFilteredByPublic(FirestoreCollection.Movie) as FirestoreMovie[];
    (await this.firestoreCollectionManagementService.getAllByUploaderFilterByPrivate(FirestoreCollection.Movie, userUid) as FirestoreMovie[]).forEach(movie => {
      this.movies.push(movie);
    })

    this.movies.sort(function (a, b) {
      return b.uploadedDate.toDate() - a.uploadedDate.toDate();
    });

    this.uploaders = await this.firestoreCollectionManagementService.getAllByMatchingList(FirestoreCollection.User, 'uid', this.movies.map(movie => movie.uploadedByUid));
    
    this.movies.map((movie) => {
      movie.uploader = this.uploaders.find(uploader => uploader.uid === movie.uploadedByUid);
      return movie;
    });

    this.loadingHelperService.removeLoadingOverlay();
    console.log(this.movies);
  }

  gotoUrl(url: string) : void {
    window.open(url, "_blank");
  }

  isOwner(uid: string | undefined) {
    return this.userUid === uid ? true : false;
  }
}
