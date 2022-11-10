import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingHelperService } from 'src/app/shared/services/loading/loading-helper.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthService, public loadingHelperService: LoadingHelperService) { }

  ngOnInit(): void {
    this.authService.authPromise.then(resolve => {
      this.loadingHelperService.removeLoadingOverlay();
    }, reject => {
      this.loadingHelperService.removeLoadingOverlay();
    });
  }

  refresh(): void {
    window.location.reload();
  } 
}
