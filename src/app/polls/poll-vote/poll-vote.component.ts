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
  @Output() voted: EventEmitter<Poll> = new EventEmitter<Poll>();
  @Output() showResults: EventEmitter<void> = new EventEmitter<void>();

  private optionSelectedId: string;
  private voterId: string;
  private voteDate: Date;
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
      if (this.authService.isSignedIn() === true) {
        for (let i = 0; i < this.poll.voters.length; i++) {
          if (this.poll.voters[i]['voterId'] === this.voterId) {
            let voteDate = this.extractVoteDateAndTime(voteInLS['voteDate']);
            this.alreadyVoted = true;
            this.optionSelectedId = this.poll.voters[i]['optionId'];
            this.statusMessage = 'You already voted on this poll on ' + + voteDate.date + ' at ' + voteDate.time;
            break;
          }
        }
      }
      else if (voteInLS !== null) {
        let voteDate = this.extractVoteDateAndTime(voteInLS['voteDate']);
        this.alreadyVoted = true;
        this.optionSelectedId = voteInLS['vote'];
        this.statusMessage = 'You or someone on this computer already voted on this poll on ' + voteDate.date + ' at ' + voteDate.time;
      }
      else {
        this.alreadyVoted = false;
        this.statusMessage = 'Choose one of the options below and submit your vote';
      }
    }
    else {
      this.alreadyVoted = false;
      this.statusMessage = 'Choose one of the options below and submit your vote';
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

  private extractVoteDateAndTime(dateString) {
    function addPendingZero(str) {
      if ((str + '').length === 1) {
        str = '0' + str;
      }
      return str;
    }
    let result = {
      date: '',
      time: ''
    };
    let date = new Date(dateString);
    result.date += date.getFullYear() + '-';
    result.date += addPendingZero(date.getMonth()) + '-';
    result.date += addPendingZero(date.getDate());
    result.time += addPendingZero(date.getHours()) + ':';
    result.time += addPendingZero(date.getMinutes()) + ':';
    result.time += addPendingZero(date.getSeconds());
    return result;
  }

  onChoseOption(event) {
    this.optionSelectedId = event.target.id;
  }

  onSubmit() {
    let that = this;
    this.voteDate = new Date();
    let vote = {
      optionId: this.optionSelectedId,
      voterId: this.voterId,
      voteDate: this.voteDate
    };
    this.submitted = true;
    this.statusMessage = 'Your vote is being sent to the server'
    this.pollStore.vote(this.poll['pollId'], vote)
    .then(function(poll: Poll) {
      that.poll = poll;
      that.alreadyVoted = true;
      that.statusMessage = 'Your vote was successfully saved. Thank you for voting!'
      that.saveVoteToLocalStorage(poll.pollId, vote);
      that.voted.emit(that.poll);
    },
    function(error) {
      that.statusMessage = 'An error happened, so your vote was not saved. Please try again or contact our support';      
    });
  }

}