import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class NotLoggedInGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.userData) {
      if (this.authService.isLoggedIn === true) {
        this.router.navigate(['dashboard']);
        return false;
      }
      return true;
    }

    return this.authService.authPromise.then(() => {
      if (this.authService.isLoggedIn === true) {
        this.router.navigate(['dashboard']);
        return false;
      }
      return true;
    }, () => {
      return true;
    });
  }
}
