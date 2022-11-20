import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/models/book';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  public users: any;
  public books: any;
  public newBook: Book = {
    id: '',
    title: '',
    description: '',
    categories: [],
    imgUrl: '',
    author: '',
    publisher: '',
    uploadedBy: '',
    approvedBy: '',
    releaseDate: new Date(),
    uploadDate: new Date(),
    lastUpdatedDate: new Date(),
    published: true
  };
  constructor(public firestoreService: FirestoreService, public loadingHelperService: LoadingHelperService) { }

  ngOnInit(): void {
    this.getBooks();
    this.loadingHelperService.removeLoadingOverlay();
  }

  async getUsers() {
    this.users = await this.firestoreService.getAllUsers();
    console.log(this.users);
 }

  async getBooks() {
    this.books = await this.firestoreService.getAllBooks();
    console.log(this.books);
  }

  async editBook(book: Book) {
    console.log(book);
    this.newBook = book;
  }

  async updateBook() {
    if (this.newBook.id) {
      let result = await this.firestoreService.updateBook(this.newBook);
      console.log(result);
    }
  }

  async deleteBook(id: string) {
    this.firestoreService.deleteBook(id);
  }
}
