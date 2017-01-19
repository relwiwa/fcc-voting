import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'poll-detail',
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})
export class PollDetailComponent implements OnInit, OnDestroy {

  private poll: Poll = null;
  private message: String = null;
  private subscription: any;

  constructor(private pollStore: PollStore, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    this.message = 'Loading poll data';
    this.subscription = this.route.params.subscribe(params => {
      this.pollStore.getPollById(params['pollId'])
      .then(
        response => {
          if (response[0]) {
            that.poll = response[0];
          }
          else {
            that.message = 'No poll with this ID exists';
          }
        },
        error => that.message = error
      );
    },
    error => that.message = error
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
