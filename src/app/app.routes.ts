import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';
import { PollsComponent } from './polls/polls/polls.component';

const APP_ROUTES: Routes = [
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',         component: DashboardComponent },
  { path: 'poll-creation',      component: PollCreationComponent },
  { path: 'polls',              component: PollsComponent }
];

export const routes = RouterModule.forRoot(APP_ROUTES);