import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { BooksComponent } from './components/books/books.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ManageMoviesComponent } from './components/manage-movies/manage-movies.component';
import { MoviesComponent } from './components/movies/movies.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { Role } from './shared/enums/role';
import { AdminGuard } from './shared/guard/admin.guard';

import { AuthGuard } from './shared/guard/auth.guard';
import { LoggedInGuard } from './shared/guard/logged-in.guard';
import { NotLoggedInGuard } from './shared/guard/not-logged-in.guard';
import { RoleGuard } from './shared/guard/role.guard';
import { SuperAdminGuard } from './shared/guard/super-admin.guard';
import { VerifiedGuard } from './shared/guard/verified.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: SignInComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [UnAuthGuard]
  { path: 'signup', component: SignUpComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [UnAuthGuard]
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard, VerifiedGuard] }, //[AuthGuard]
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NotLoggedInGuard] }, //, canActivate: [AuthGuard]
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [LoggedInGuard] },
  { path: 'books', component: BooksComponent, canActivate: [LoggedInGuard, VerifiedGuard] },
  { path: 'add-book', component: AddBookComponent, canActivate: [LoggedInGuard, VerifiedGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [LoggedInGuard, VerifiedGuard, RoleGuard], data: { allowedRoles: [Role.SuperAdmin, Role.Admin] } },
  { path: 'edit-user/:uid', component: EditUserComponent, canActivate: [LoggedInGuard, VerifiedGuard, RoleGuard], data: { allowedRoles: [Role.SuperAdmin, Role.Admin] } },
  { path: 'add-movie', component: AddMovieComponent, canActivate: [LoggedInGuard, VerifiedGuard, RoleGuard], data: { allowedRoles: [Role.SuperAdmin, Role.Admin, Role.Contributor] } },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie-management', component: ManageMoviesComponent },
  { path: 'edit-movie/:uid', component: AddMovieComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
