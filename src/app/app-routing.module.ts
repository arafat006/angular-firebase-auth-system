import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

import { AuthGuard } from './shared/guard/auth.guard';
import { LoggedInGuard } from './shared/guard/logged-in.guard';
import { NotLoggedInGuard } from './shared/guard/not-logged-in.guard';
import { VerifiedGuard } from './shared/guard/verified.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: SignInComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [UnAuthGuard]
  { path: 'signup', component: SignUpComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [UnAuthGuard]
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard, VerifiedGuard] }, //[AuthGuard]
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [AuthGuard]
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [LoggedInGuard] },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
