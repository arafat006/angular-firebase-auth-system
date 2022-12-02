import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreUsersService } from 'src/app/shared/services/firestore/firestore-users.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService: AuthService, public loadingHelperService: LoadingHelperService, public firestoreUsersService: FirestoreUsersService) {
    
  }

  ngOnInit(): void {
    this.loadingHelperService.removeLoadingOverlay();
    // console.log(this.authService.userData);
  }
}
