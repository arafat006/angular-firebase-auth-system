import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  userLoggedIn: boolean | null = null;
  userVerified: boolean | undefined;
  
  constructor(public authService: AuthService) { }

  async ngOnInit(): Promise<void> {

    this.userLoggedIn = await this.authService.isLoggedInAsync();
    this.userVerified = await this.authService.isVerifiedAsync();
  }

}
