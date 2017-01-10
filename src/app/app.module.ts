import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './user/authentication/authentication.component';
import { SignupComponent } from './user/signup/signup.component';
import { SigninComponent } from './user/signin/signin.component';
import { LogoutComponent } from './user/logout/logout.component';
import { PollsComponent } from './polls/polls/polls.component';
import { PollDetailComponent } from './polls/poll-detail/poll-detail.component';
import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';
import { ErrorComponent } from './errors/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    SignupComponent,
    SigninComponent,
    LogoutComponent,
    PollsComponent,
    PollDetailComponent,
    PollCreationComponent,
    ErrorComponent
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
