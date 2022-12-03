import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { first, map, Observable } from 'rxjs';
import { FirebaseCollection } from '../../enums/firebase-collection';
import { Role } from '../../enums/role';
import { FirestoreUser } from '../../models/firestore-user';
import { AuthService } from '../auth.service'; 

@Injectable({
  providedIn: 'root'
})

export class FirestoreUsersService {

  firestoreUser: FirestoreUser | null = null;
  userList: FirestoreUser[] = [];

  constructor(public angularFirestore: AngularFirestore, public authService: AuthService) {

  }

  getAllUsers() {
    return this.angularFirestore.collection<any>(FirebaseCollection.User,
      ref => ref.orderBy("email")
    ).valueChanges();
  }  

  getUser(uid: string) {
    return this.angularFirestore.collection(FirebaseCollection.User).doc(uid).get();
  }  

  updateUser(uid: string, user: FirestoreUser) {
    return this.angularFirestore.collection(FirebaseCollection.User).doc(uid).update(user);
  }  

  rolePromise = new Promise<void>((resolve, reject) => {
    this.authService.authPromise.then(() => {
      if (this.authService.isLoggedIn === true) {
        const userRef = this.angularFirestore.collection(FirebaseCollection.User).doc(this.authService.userData.uid);
        userRef.get().subscribe(user => {
          if (user.exists) {
            this.firestoreUser = user.data() as FirestoreUser;

            if (!this.firestoreUser.role) {
              this.firestoreUser.role = Role.User;
            }
            if (!this.firestoreUser.isDisabled) {
              this.firestoreUser.isDisabled = false;
            }

            resolve();
          } else {
            this.firestoreUser = null;
            reject();
          }
        });
      } else {
        reject();
      }
    }, () => { 
      reject();
    });
  });

  get isSuperAdmin(): boolean {
    return this.firestoreUser ? this.firestoreUser.role === Role.SuperAdmin : false;
  }

  get isAdmin(): boolean {
    return this.firestoreUser ? this.firestoreUser.role === Role.Admin : false;
  }

  get isContributor(): boolean {
    return this.firestoreUser ? this.firestoreUser.role === Role.Contributor : false;
  }

  get isUser(): boolean {
    return this.firestoreUser ? this.firestoreUser.role === Role.User : false;
  }


  async getUserRoleAsync() {
    return await this.rolePromise.then(() => {
      return this.firestoreUser?.role as Role;
    }, () => {
      return Role.User;
    });
  }

  async isSuperAdminAsync() {
    return await this.rolePromise.then(() => {
      return this.firestoreUser?.role === Role.SuperAdmin;
    }, () => {
      return false;
    });
  }

  async isAdminAsync() {
    return await this.rolePromise.then(() => {
      return this.firestoreUser?.role === Role.Admin;
    }, () => {
      return false;
    });
  }

  async isContributorAsync() {
    return await this.rolePromise.then(() => {
      return this.firestoreUser?.role === Role.Contributor;
    }, () => {
      return false;
    });
  }

  async isUserAsync() {
    return await this.rolePromise.then(() => {
      return this.firestoreUser?.role === Role.User;
    }, () => {
      return false;
    });
  }
}
