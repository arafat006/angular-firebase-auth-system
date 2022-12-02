import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../enums/role';
import { FirestoreUsersService } from '../services/firestore/firestore-users.service';

@Injectable({
  providedIn: 'root'
})
export class ContributorGuard implements CanActivate {
  constructor(
    public firestoreUsersService: FirestoreUsersService,
    public router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return this.firestoreUsersService.rolePromise.then(() => {
        if (this.firestoreUsersService.firestoreUser?.role === Role.Contributor) {
          return true;
        }
        this.router.navigate(['dashboard']);
        return false;
      }, () => {
        this.router.navigate(['dashboard']);
        return false;
      });  
  }
}
