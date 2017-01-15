import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Poll } from '../poll.model';
import { PollService } from '../poll.service';

@Component({
  selector: 'poll-detail',
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})
export class PollDetailComponent implements OnInit, OnDestroy {

  private poll: Poll = null;
  private subscription: any;

  constructor(private pollService: PollService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.poll = this.pollService.getPollById(params['pollId'])[0];
      console.log(this.poll);
    },
    error => console.log(error)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
