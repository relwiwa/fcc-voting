import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../user/authentication.service';
import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'poll-detail',
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})

export class PollDetailComponent implements OnInit, OnDestroy {
  private poll: Poll;
  private pollId: string;
  private subscription: any;

  private userOwnsPoll: boolean;
  private showResults: boolean;

  constructor(private pollStore: PollStore,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) {
    this.poll = null;
    this.pollId = null;
    this.userOwnsPoll = null;
    this.showResults = false;
  }

  ngOnInit() {
    let that = this;
    this.subscription = this.route.params
    .subscribe(params => {
      // todo: validate pollId
      that.pollId = params['pollId'];
      that.pollStore.getPollById(that.pollId)
      .then(
        response => {
          // duplicate check for existing poll, should be handled by reject function
          if (response[0]) {
            that.poll = response[0];
            if (that.poll.creatorId === that.authService.getUserId()) {
              that.userOwnsPoll = true;
              that.showResults = true;
            }
            else {
              that.userOwnsPoll = false;
            }
          }
          else {
//            that.errorMessage = 'No poll with this ID exists';
          }
        },
        error => {
//          that.errorMessage = error.message;
        }
      );
    },
      error => {
//        that.errorMessage = error.message;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updatePoll(poll: Poll) {
    this.poll = poll;
  }

}