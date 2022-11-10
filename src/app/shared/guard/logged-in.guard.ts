import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class LoggedInGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.userData) {
      if (this.authService.isLoggedIn === true) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }

    return this.authService.authPromise.then(() => {
      if (this.authService.isLoggedIn === true) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }, () => {
      this.router.navigate(['login']);
      return false;
    });
  }
}
