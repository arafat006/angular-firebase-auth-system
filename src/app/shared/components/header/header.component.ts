import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { Role } from '../../enums/role';
import { FirestoreUser } from '../../models/firestore-user';
import { AuthService } from '../../services/auth.service';
import { FirestoreUsersService } from '../../services/firestore/firestore-users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  userLoggedIn: boolean | null = null;
  userVerified: boolean | undefined;
  userRole: Role = Role.User;
  userList: FirestoreUser[] = [];

  constructor(public authService: AuthService, public firestoreUsersService: FirestoreUsersService) { }

  async ngOnInit(): Promise<void> {

    this.userLoggedIn = await this.authService.isLoggedInAsync();
    this.userVerified = await this.authService.isVerifiedAsync();
    this.userRole = await this.firestoreUsersService.getUserRoleAsync();
    console.log('Role: ', this.userRole);
  }

}
