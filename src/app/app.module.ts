import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './layout/app-header/app-header.component';
import { AuthenticationComponent } from './user/authentication/authentication.component';
import { AuthenticationService } from './user/authentication.service';
import { ErrorComponent } from './errors/error/error.component';
import { LogoutComponent } from './user/logout/logout.component';
import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';
import { PollDetailComponent } from './polls/poll-detail/poll-detail.component';
import { PollsComponent } from './polls/polls/polls.component';
import { routes } from './app.routes';
import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { PollsListComponent } from './polls/polls-list/polls-list.component';
import { PollStore } from './polls/pollStore.service';
import { PollBackendService } from './polls/pollBackend.service';

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
    SignupComponent,
    DashboardComponent,
    PollsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    routes
  ],
  providers: [
    AuthenticationService,
    PollBackendService,
    PollStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
