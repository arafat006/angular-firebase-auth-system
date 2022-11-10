import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.authService.userData) {
      if (this.authService.isLoggedIn === true) {
        if (this.authService.isVerified === true) {
          return true;
        }
        this.router.navigate(['verify-email-address']);
        return false;
      }
      this.router.navigate(['login']);
      return false;
    }

    return this.authService.authPromise.then(() => {
      if (this.authService.isLoggedIn === true) {
        if (this.authService.isVerified === true) {
          return true;
        }
        this.router.navigate(['verify-email-address']);
        return false;
      }
      this.router.navigate(['login']);
      return false;
    }, () => {
      this.router.navigate(['login']);
      return false;
    });
  }
}