import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthenticationService } from '../../user/authentication.service';
import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'poll-vote',
  templateUrl: './poll-vote.component.html',
  styleUrls: ['./poll-vote.component.css']
})
export class PollVoteComponent implements OnInit {

  @Input() poll: Poll;
  @Output() showResults: EventEmitter<void> = new EventEmitter<void>();

  private optionSelectedId: number;
  private voterId: string;
  private alreadyVoted: boolean;
  private submitted: boolean;

  private statusMessage: string;

  constructor(private authService: AuthenticationService,
              private pollStore: PollStore) { }

  ngOnInit() {
    let that = this;
    this.voterId = that.authService.getUserId();
    this.setupAlreadyVoted();
  }

  // todo cookie-based check
  private setupAlreadyVoted() {
    if (this.poll.voters) {
      if (this.authService.isSignedIn() === true) {
        for (let i = 0; i < this.poll.voters.length; i++) {
          if (this.poll.voters[i]['voterId'] === this.voterId) {
            this.alreadyVoted = true;
            this.optionSelectedId = this.poll.voters[i]['optionId'];
            this.statusMessage = 'You already cast a vote on this poll on ' + this.poll.voters[i]['voteDate'];
            break;
          }
        }
      }
      /* to do: check for vote stored in cookie for unauthorized user
      else if () {
      }*/
      else {
        this.alreadyVoted = false;
        this.statusMessage = 'Chose one of the options below and submit your vote';
      }
    }
    else {
      this.alreadyVoted = false;
      this.statusMessage = 'Chose one of the options below and submit your vote';
    }
  }

  onChoseOption(event) {
    this.optionSelectedId = event.target.id;
  }

  onSubmit() {
    let that = this;
    let vote = {
      optionId: this.optionSelectedId,
      voterId: this.voterId
    };
    this.submitted = true;
    this.statusMessage = 'Your vote is being sent to the server'
    this.pollStore.vote(this.poll['pollId'], vote)
    .then(function(poll: Poll) {
      that.poll = poll;
      that.alreadyVoted = true;
      that.statusMessage = 'Your vote was successfully saved. Thank you for voting!'
      // todo: set cookie with vote info
    },
    function(error) {
      that.statusMessage = 'An error happened, so your vote was not saved. Please try again or contact our support';      
    });
  }

}
