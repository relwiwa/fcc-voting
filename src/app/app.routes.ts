import { Routes, RouterModule } from '@angular/router';

import { PollCreationComponent } from './polls/poll-creation/poll-creation.component';

const APP_ROUTES: Routes = [
  { path: '',           redirectTo: '/poll-creation', pathMatch: 'full' },
  { path: 'poll-creation',      component: PollCreationComponent }
];

export const routes = RouterModule.forRoot(APP_ROUTES);