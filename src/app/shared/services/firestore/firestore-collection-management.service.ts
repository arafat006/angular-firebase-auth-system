import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreCollection } from '../../enums/firestore-collection';
import { FirestoreMovie } from '../../models/firestore-movie';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCollectionManagementService {

  constructor(public angularFirestore: AngularFirestore, public authService: AuthService) {

  }

  add(collection: FirestoreCollection, doc: any) {
    return this.angularFirestore.collection(collection).add(doc);
  }

  get(collection: FirestoreCollection, uid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(collection).doc(uid).valueChanges({ idField: 'uid' }).subscribe(doc => resolve(doc));
    });
  } 

  update(collection: FirestoreCollection, uid: string, doc: FirestoreMovie) {
    return this.angularFirestore.collection(collection).doc(uid).update(doc);
  } 

  delete(collection: FirestoreCollection, uid: string) {
    return this.angularFirestore.collection(collection).doc(uid).delete();
  }

  getAll(collection: FirestoreCollection) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(collection).valueChanges({ idField: 'uid' }).subscribe(docs => resolve(docs));
    });
  }

  getAllByUploader(collection: FirestoreCollection, uploaderUid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection(collection, ref => ref.where('uploadedByUid', '==', uploaderUid))
        .valueChanges({ idField: 'uid' })
        .subscribe(docs => resolve(docs));
    });
  }

  getAllByUploaderUntracked(collection: FirestoreCollection, uploaderUid: string) {
    return this.angularFirestore.collection(collection, ref => ref.where('uploadedByUid', '==', uploaderUid)).get();
  }

  getAllFilteredByPublic(collection: FirestoreCollection) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection<any>(collection, 
          ref => ref.where('private', '==', false))
        .valueChanges({ idField: 'uid' }).subscribe(docs => resolve(docs));
    });
  }

  getAllByUploaderFilterByPrivate(collection: FirestoreCollection, uploaderUid: string) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection<any>(collection, 
          ref => ref.where('private', '==', true).where('uploadedByUid', '==', uploaderUid))
        .valueChanges({ idField: 'uid' }).subscribe(docs => resolve(docs));
    });
  }

  getAllByMatchingList(collection: FirestoreCollection, matchProperty: string, list: any[]) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection<any>(collection,
        ref => ref.where(matchProperty, 'in', list)
      ).valueChanges({ idField: 'uid' }).subscribe(docs => resolve(docs));
    });
  }
}
