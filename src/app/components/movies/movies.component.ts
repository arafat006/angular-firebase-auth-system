import { Component, OnInit } from '@angular/core';
import { FirebaseCollection } from 'src/app/shared/enums/firebase-collection';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { FirestoreUploader } from 'src/app/shared/models/firestore-uploader';
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

  constructor(public firestoreMoviesService: FirestoreMoviesService, public loadingHelperService: LoadingHelperService, public firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.getMovies();
  }

  async getMovies() {
    this.movies = await this.firestoreMoviesService.getAllMovies();
    this.uploaders = await this.firestoreService.getDocumentsByList(FirebaseCollection.User, 'uid', this.movies.map(movie => movie.uploadedByUid));
    
    this.movies.map((movie) => {
      movie.uploader = this.uploaders.find(uploader => uploader.uid === movie.uploadedByUid);
      return movie;
    });

    this.loadingHelperService.removeLoadingOverlay();
    console.log(this.movies);
  }
}
