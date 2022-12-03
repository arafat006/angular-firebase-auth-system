import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FirebaseCollection } from 'src/app/shared/enums/firebase-collection';
import { Role } from 'src/app/shared/enums/role';
import { FirestoreMovie } from 'src/app/shared/models/firestore-movie';
import { FirestoreUser } from 'src/app/shared/models/firestore-user';
import { FirestoreMoviesService } from 'src/app/shared/services/firestore/firestore-movies.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-movie-theater',
  templateUrl: './movie-theater.component.html',
  styleUrls: ['./movie-theater.component.css']
})
export class MovieTheaterComponent implements OnInit {

  uid: string = '';
  movie: FirestoreMovie | null = null;

  constructor(public firestoreMoviesService: FirestoreMoviesService, 
    public loadingHelperService: LoadingHelperService, 
    public firestoreService: FirestoreService,
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.uid = params.get('uid') ?? '';
      if (this.uid) {
        this.getMovies();
        this.loadingHelperService.removeLoadingOverlay();
      }
    });
  }

  async getMovies() {
    this.movie = await this.firestoreMoviesService.getMovie(this.uid);
    console.log(this.movie);
  }
}
