import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { reduce } from 'rxjs';
import { FirestoreCollection } from '../../enums/firestore-collection';
import { FirestoreMovie } from '../../models/firestore-movie';
import { FirestoreUser } from '../../models/firestore-user';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreMoviesService {

  firestoreUser: FirestoreMovie | null = null;

  constructor(public angularFirestore: AngularFirestore, public authService: AuthService) {

  }

  // getAllMovies() {
  //   return this.angularFirestore.collection<any>(FirestoreCollection.Movie,
  //     ref => ref
  //   ).valueChanges();
  // }  

  getAllMovies() {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(FirestoreCollection.Movie).valueChanges({ idField: 'id' }).subscribe(movies => resolve(movies));
    });
  }

  getMoviesUploadedByUid(uid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(FirestoreCollection.Movie, ref => ref.where('uploadedByUid', '==', uid))
        .valueChanges({ idField: 'id' })
        .subscribe(movies => resolve(movies));
    });
  }

  addMovie(movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirestoreCollection.Movie).add(movie);
  }

  updateMovie(uid: string, movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirestoreCollection.Movie).doc(uid).update(movie);
  } 

  getMovie(uid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(FirestoreCollection.Movie).doc(uid).valueChanges({ idField: 'uid' }).subscribe(movies => resolve(movies));
    });
  }  

  deleteBook(uid: string) {
    return this.angularFirestore.doc(`${FirestoreCollection.Movie}/${uid}`).delete();
  }
}
