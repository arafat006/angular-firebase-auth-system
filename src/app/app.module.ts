import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthService } from './shared/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToastModule } from 'ng-angular-popup';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { PopupMessageComponent } from './shared/modals/popup-message/popup-message.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { BooksComponent } from './components/books/books.component';
import { FormsModule } from '@angular/forms';
import { AddBookComponent } from './components/add-book/add-book.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieTheaterComponent } from './components/movie-theater/movie-theater.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    HeaderComponent,
    FooterComponent,
    PopupMessageComponent,
    BooksComponent,
    AddBookComponent,
    UserManagementComponent,
    EditUserComponent,
    AddMovieComponent,
    MoviesComponent,
    MovieTheaterComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    AvatarModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MdbModalModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
