import { Component, OnInit } from '@angular/core';
import { Book } from '../../shared/models/book';
import { FirestoreService } from '../../shared/services/firestore/firestore.service';
import { LoadingHelperService } from '../../shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  public newBook: Book = {
    id: null,
    title: 'Test Title',
    description: 'Test des',
    categories: ['Islamic'],
    imgUrl: 'test url',
    author: 'Author 2',
    publisher: 'Publisher 3',
    uploadedBy: 'Arafat',
    approvedBy: 'Admin 6',
    releaseDate: new Date(),
    uploadDate: new Date(),
    lastUpdatedDate: new Date(),
    published: true
  };
  constructor(public firestoreService: FirestoreService, public loadingHelperService: LoadingHelperService) { }

  ngOnInit(): void {
    this.loadingHelperService.removeLoadingOverlay();
  }

  async addBook() {
    let result = await this.firestoreService.addBook(this.newBook);
    console.log(result);
  }
  
}
