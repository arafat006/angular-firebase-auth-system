import { Component, OnInit } from '@angular/core';
import { FirestoreUser } from 'src/app/shared/models/firestore-user';
import { FirestoreUsersService } from 'src/app/shared/services/firestore/firestore-users.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  userList: FirestoreUser[] = []

  constructor(public loadingHelperService: LoadingHelperService, public firestoreUsersService: FirestoreUsersService) { }

  ngOnInit(): void {
    
    this.firestoreUsersService.getAllUsers().subscribe(result => {
      this.userList = result as FirestoreUser[];
      this.loadingHelperService.removeLoadingOverlay();
    });
  }

}
