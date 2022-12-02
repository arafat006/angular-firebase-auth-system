import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { FirestoreUser } from '../models/firestore-user';
import { FirebaseCollection } from '../enums/firebase-collection';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userData: any | undefined; // Save logged in user data

  constructor(
    public angularFirestore: AngularFirestore, // Inject Firestore service
    public angularFireAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
    ) {
    
    // console.log(this.angularFireAuth);
    // console.log(this.angularFireAuth.authState);
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.authPromise.then(() => {}, () => {});


    // this.angularFireAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.userData = user;
    //     // console.log(this.userData);
    //     // localStorage.setItem('user', JSON.stringify(this.userData));
    //     // JSON.parse(localStorage.getItem('user')!);
    //   } else {
    //     this.userData = null;
    //     // localStorage.setItem('user', 'null');
    //     // JSON.parse(localStorage.getItem('user')!);
    //   }
    // });
  }

  authPromise = new Promise<void>((resolve, reject) => {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        resolve();
      } else {
        this.userData = null;
        reject();
      }
    });
  });

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            this.userData = user;
            this.router.navigate(['dashboard']);
          }
        });
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, displayName: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.UpdateDisplayName(result.user, displayName);
        this.SendVerificationMail();
        this.setUserData(result.user, displayName);
        this.userData = result.user;
        return result;
      });
  }

  UpdateDisplayName(user: any, displayName: string){
    user.updateProfile({ displayName: displayName })
        .then()
        .catch();
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.angularFireAuth.currentUser
      .then((u: any) => u.sendEmailVerification());
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.angularFireAuth
      .sendPasswordResetEmail(passwordResetEmail);
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return this.userData !== null;
  }

  async isLoggedInAsync() {
    return await this.authPromise.then(() => {
      return this.userData !== null;
    }, () => {
      return false;
    });
  }

  get isVerified(): boolean {
    return this.userData?.emailVerified === true ? true : false;
  }

  async isVerifiedAsync() {
    return await this.authPromise.then(() => {
      return this.userData?.emailVerified === true ? true : false;
    }, () => {
      return false;
    });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user);
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any, displayName?: string) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `${FirebaseCollection.UserTable}/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: displayName ?? user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  
  // Sign out
  SignOut() {
    return this.angularFireAuth.signOut().then(() => {
      // localStorage.removeItem('user');
      this.userData = null;
      this.router.navigate(['login']);
    });
  }
}