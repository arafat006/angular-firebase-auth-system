import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Book } from '../../models/book';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { 

  }

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
