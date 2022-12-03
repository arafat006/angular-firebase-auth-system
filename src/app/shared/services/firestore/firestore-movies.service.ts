import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseCollection } from '../../enums/firebase-collection';
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
  //   return this.angularFirestore.collection<any>(FirebaseCollection.Movie,
  //     ref => ref
  //   ).valueChanges();
  // }  

  getAllMovies() {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(FirebaseCollection.Movie).valueChanges({ idField: 'id' }).subscribe(movies => resolve(movies));
    });
  }

  addMovie(movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirebaseCollection.Movie).add(movie);
  }

  updateMovie(uid: string, movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirebaseCollection.Movie).doc(uid).update(movie);
  } 

  getMovie(uid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(FirebaseCollection.Movie).doc(uid).valueChanges({ idField: 'uid' }).subscribe(movies => resolve(movies));
    });
  }  

  deleteBook(uid: string) {
    return this.angularFirestore.doc(`${FirebaseCollection.Movie}/${uid}`).delete();
  }
}
