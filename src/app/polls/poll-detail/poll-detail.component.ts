import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'poll-detail',
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})
export class PollDetailComponent implements OnInit, OnDestroy {

  private poll: Poll = null;
  private pollId: string = null;
  private message: string = null;
  private errorMessage: string = null;
  private subscription: any;

  constructor(private pollStore: PollStore, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let that = this;
    this.message = 'Loading poll data';
    this.subscription = this.route.params
    .subscribe(params => {
      that.pollId = params['pollId'];
      this.pollStore.getPollById(that.pollId)
      .then(
        response => {
          if (response[0]) {
            that.poll = response[0];
            that.message = null;
          }
          else {
            that.message = null;
            that.errorMessage = 'No poll with this ID exists';
          }
        },
        error => {
          that.errorMessage = error.message;
        }
      );
    },
      error => {
        that.errorMessage = error.message;
      }
    );
  }

  deletePoll() {
    let that = this;
    this.pollStore.deletePoll(that.pollId)
    .then(
      deletedPoll => {
        this.router.navigateByUrl('/polls');
      },
      error => {
        that.errorMessage = error.message;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
