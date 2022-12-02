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

  getAllMovies() {
    return this.angularFirestore.collection<any>(FirebaseCollection.MovieTable,
      ref => ref
    ).valueChanges();
  }  

  addMovie(movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirebaseCollection.MovieTable).add(movie);
  }

  updateMovie(uid: string, movie: FirestoreMovie) {
    return this.angularFirestore.collection(FirebaseCollection.MovieTable).doc(uid).update(movie);
  } 

  getMovie(uid: string) {
    return this.angularFirestore.collection(FirebaseCollection.MovieTable).doc(uid).get();
  }  

  deleteBook(uid: string) {
    return this.angularFirestore.doc(`${FirebaseCollection.MovieTable}/${uid}`).delete();
  }
}
