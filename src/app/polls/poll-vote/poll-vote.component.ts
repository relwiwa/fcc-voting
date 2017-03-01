import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthenticationService } from '../../user/authentication.service';
import { Poll } from '../poll.model';
import { PollStore } from '../poll-store.service';

@Component({
  selector: 'poll-vote',
  templateUrl: './poll-vote.component.html',
  styleUrls: ['./poll-vote.component.css']
})
export class PollVoteComponent implements OnInit {

  @Input() poll: Poll;
  @Output() voted: EventEmitter<Poll> = new EventEmitter<Poll>();
  @Output() showResults: EventEmitter<void> = new EventEmitter<void>();

  private optionSelectedId: string;
  private voterId: string;
  private voteDate: Date;
  private isSignedIn: boolean;
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

  private setupAlreadyVoted() {
    if (this.poll.voters) {
      let voteInLS = this.checkVoteInLocalStorage(this.poll.pollId);
      this.isSignedIn = this.authService.isSignedIn();
      if (this.isSignedIn === true) {
        for (let i = 0; i < this.poll.voters.length; i++) {
          if (this.poll.voters[i]['voterId'] === this.voterId) {
            this.voteDate = this.poll.voters[i]['voteDate'];
            this.alreadyVoted = true;
            this.optionSelectedId = this.poll.voters[i]['optionId'];
            break;
          }          
        }
      }
      else if (voteInLS !== null) {
        this.voteDate = voteInLS['voteDate'];
        this.alreadyVoted = true;
        this.optionSelectedId = voteInLS['vote'];
      }
      else {
        this.alreadyVoted = false;
      }
    }
    else {
      this.alreadyVoted = false;
    }
  }

  private saveVoteToLocalStorage(pollId, vote) {
    let voteDetails = {
      vote: vote.optionId,
      voteDate: vote.voteDate
    }
    localStorage.setItem(pollId, JSON.stringify(voteDetails));
  }

  private checkVoteInLocalStorage(pollId) {
    let voteInLS = localStorage.getItem(pollId);
    if (voteInLS === null) {
      return null;      
    }
    else {
      return JSON.parse(voteInLS);
    }
  }

  onChoseOption(event) {
    this.optionSelectedId = event.target.id;
  }

  onSubmit() {
    this.voteDate = new Date();
    let vote = {
      optionId: this.optionSelectedId,
      voterId: this.voterId,
      voteDate: this.voteDate
    };
    this.submitted = true;
    this.statusMessage = 'Your vote is being sent to the server'
    this.pollStore.vote(this.poll['pollId'], vote)
    .subscribe((poll: Poll) => {
      this.poll = poll;
      this.alreadyVoted = true;
      this.statusMessage = 'Your vote was successfully saved. Thank you for voting!'
      if (this.authService.isSignedIn() === false) {
        this.saveVoteToLocalStorage(poll.pollId, vote);
      }
      this.voted.emit(this.poll);
    },
    (error) => {
      this.statusMessage = 'An error happened, so your vote was not saved. Please try again or contact our support';      
    });
  }

}