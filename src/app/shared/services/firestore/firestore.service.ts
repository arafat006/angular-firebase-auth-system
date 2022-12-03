import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseCollection } from '../../enums/firebase-collection';
import { Book } from '../../models/book';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { 

  }

  getDocumentsByList(collection: FirebaseCollection, matchProperty: string, list: any[]) {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection<any>(collection,
        ref => ref.where(matchProperty, 'in', list)
      ).valueChanges({ idField: 'id' }).subscribe(docs => resolve(docs));
    });
  }

  // getDocumentsByList(collection: FirebaseCollection, matchProperty: string, list: any) {
  //   return new Promise<any>((resolve) => {
  //     this.angularFirestore.collection(collection, ref => ref.where('uid', '==', list)).valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
  //   })
  // }

  getAllUsers() {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection('User').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }

  getAllBooks() {
    return new Promise<any>((resolve) => {
      this.angularFirestore.collection('Book').valueChanges({ idField: 'id' }).subscribe(books => resolve(books));
    })
  }

  // addNewUser(_newId: any, _fName: string, _lName: string, _vip: boolean) {
  //   this.angularFirestore.collection(& quot; User & quot;).doc(_newId).set({ firstName: _fName, lastName: _lName, vipMember: _vip });
  // }

  addBook(book: Book) {
    this.angularFirestore.collection('Book').add(book);
    this.getAllBooks();
  }

  updateBook(book: Book) {
    this.angularFirestore.doc(`Book/${book.id}`).update(book);
  }

  deleteBook(id:any) {
    this.angularFirestore.doc(`Book/${id}`).delete();
  }

}
