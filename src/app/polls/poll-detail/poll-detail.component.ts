import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'poll-detail',
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css']
})

export class PollDetailComponent implements OnInit, OnDestroy {

  // poll
  private poll: Poll;
  private pollId: string;
  private subscription: any;

  // vote
  private optionSelectedId: number;
  private submitted: boolean;

  // voter  
  private voterId: string;
  private alreadyVoted: boolean;

  // creator

  // messages
  private errorMessage: string;;

  constructor(private pollStore: PollStore,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthenticationService) {
    this.poll = null;
    this.pollId = null;
    this.optionSelectedId = null;
    this.submitted = false;
    this.voterId = null;
    this.alreadyVoted = null;
    this.errorMessage = null;
  }

  // todo cookie- and signin-based check
  private hasUserAlreadyVoted() {

  }

  // todo
  private hasUserCreatedPoll() {

  }

  ngOnInit() {
    let that = this;
    this.voterId = that.authService.getUserId();
    this.subscription = this.route.params
    .subscribe(params => {
      that.pollId = params['pollId'];
      that.pollStore.getPollById(that.pollId)
      .then(
        response => {
          if (response[0]) {
            that.poll = response[0];
            if (that.poll.voters.length > 0) {
              if (that.authService.isSignedIn() === true) {
                for (let i = 0; i < that.poll.voters.length; i++) {
                  if (that.poll.voters[i]['voterId'] === that.voterId) {
                    console.log('already voted');
                    that.alreadyVoted = true;
                  }
                }
              }
            }
          }
          else {
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

  onClick(event) {
    event.preventDefault();
    this.optionSelectedId = event.target.id;
  }

  onSubmit() {
    let that = this;
    let vote = {
      optionId: this.optionSelectedId,
      voterId: this.voterId
    };
    this.submitted = true;
    this.pollStore.vote(this.poll['pollId'], vote)
    .then(function(poll: Poll) {
      that.poll = poll;
      console.log(that.poll);
      that.alreadyVoted = true;
      // go to poll-detail -> status: voted + showoption to see results
    },
    function(error) {
      console.log(error);      
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
