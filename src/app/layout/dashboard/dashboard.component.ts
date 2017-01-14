import { Component, OnInit } from '@angular/core';

import { Poll } from '../../polls/poll.model';
import { PollService } from '../../polls/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  polls: Poll[] = null;

  constructor(private pollService: PollService) { }

  ngOnInit() {
    this.pollService.getPolls()
      .subscribe(
        (polls: Poll[]) => {
          this.polls = polls;
        },
        error => console.log(error)
      );
  }

}
