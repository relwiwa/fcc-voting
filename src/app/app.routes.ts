import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './layout/dashboard/dashboard.component';

import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';
import { PollDetailComponent } from './polls/poll-detail/poll-detail.component';
import { PollsComponent } from './polls/polls/polls.component';

import { SigninComponent } from './user/signin/signin.component';
import { SignupComponent } from './user/signup/signup.component';

const APP_ROUTES: Routes = [
  { path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' },
  { path: 'dashboard',
    component: DashboardComponent },
  { path: 'poll-creation',
    component: PollCreationComponent },
  { path: 'polls',
    component: PollsComponent },
  { path: 'poll/:pollId',
    component: PollDetailComponent },
  { path: 'signup',
    component: SignupComponent },
  { path: 'signin',
    component: SigninComponent }
];

export const routes = RouterModule.forRoot(APP_ROUTES);