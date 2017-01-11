import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './user/authentication/authentication.component';
import { ErrorComponent } from './errors/error/error.component';
import { AppHeaderComponent } from './layout/app-header/app-header.component';
import { LogoutComponent } from './user/logout/logout.component';
import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';
import { PollDetailComponent } from './polls/poll-detail/poll-detail.component';
import { PollsComponent } from './polls/polls/polls.component';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AuthenticationComponent,
    ErrorComponent,
    LogoutComponent,
    PollCreationComponent,
    PollDetailComponent,
    PollsComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
