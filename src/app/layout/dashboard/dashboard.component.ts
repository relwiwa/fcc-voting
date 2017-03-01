import { Component } from '@angular/core';

import { Poll } from '../../polls/poll.model';
import { PollStore } from '../../polls/poll-store.service';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  constructor(private authService: AuthenticationService) { }

}
