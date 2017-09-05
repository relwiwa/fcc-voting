import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Poll } from './poll.model';
import { PollBackendService } from './poll-backend.service';
import { PollsService } from './polls.service';

import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class PollStore {
  private polls: Poll[] = null;
  private observable: Observable<any>;
  private socket;
  private socketId: string;
  private backendUrl;

  constructor(private pollBackendService: PollBackendService,
              private pollsService: PollsService) {
    this.backendUrl = this.pollsService.setupBackendUrl();
    this.setupSocket();
  }

  private setupSocket() {
    let that = this;
    this.socket = io.connect(this.backendUrl);
    this.socket.on('connected', function(data) {
      that.socketId = data.socketId;
      console.log('connected', data);
    });
    this.socket.on('poll-created', function(data) {
      console.log('poll-created', data);
    })
    this.socket.on('option-added', function(data) {
      console.log('option-added');
    })
    this.socket.on('vote-added', function(data) {
      const updatedPoll = data.response;
      let updatedLocalPoll = that.updateVote(updatedPoll);
      console.log('vote was added to cache via socket', updatedLocalPoll);
    });
    this.socket.on('poll-deleted', function(data) {
      console.log('poll-deleted', data);
    })
  }

    /* local caching strategy with observables adapted from:
     - https://plnkr.co/edit/WpDtCkS4gslYwousZlmi?p=preview
     - http://www.syntaxsuccess.com/viewarticle/combining-multiple-rxjs-streams-in-angular-2.0 */
  public getAllPolls() {
    if (this.polls) {
      return Observable.of(this.polls);
    }
    else if (this.observable) {
      return this.observable;      
    }
    else {
      this.observable = this.pollBackendService.getAllPolls()
        .map((response: Response) => {
          this.observable = null;
          if (response.status === 200) {
            let polls: Poll[] = [];
            const incomingPolls = response.json().response;
            incomingPolls.map((poll: any) => {
              let newPoll = this.createLocalPoll(poll);
              polls.push(newPoll);
            });
            this.polls = polls;
            return this.polls;
          }
        })
        .share();
      return this.observable;
    }
  }

  public vote(pollId, vote) {
    let observable = this.pollBackendService.vote(pollId, vote, this.socketId)
    .map((response) => {
      const updatedPoll = response.json().response;
      let updatedLocalPoll = this.updateVote(updatedPoll);
      console.log('vote was added to cache via server response', updatedLocalPoll);
      return updatedLocalPoll;
    });
    return observable;
  }

  private updateVote(updatedPoll) {
    let updatedLocalPoll = null;
    for (let i = 0; i < this.polls.length; i++) {
      if (updatedPoll['pollId'] === this.polls[i].pollId) {
        let voterAlreadyThere = false;
        for (let j = 0; j < this.polls[i].voters.length; j++) {
          if (this.polls[i].voters[j]['_id'] === updatedPoll['newVote']['_id']) {
            voterAlreadyThere = true;
            break;
          }
        }
        if (!voterAlreadyThere) {
          this.polls[i].voters.push(updatedPoll['newVote']);
          for (let j = 0; j < this.polls[i].options.length; j++) {
            if (this.polls[i].options[j]['_id'] === updatedPoll['optionId']) {
              this.polls[i].options[j]['votes']++;
            }
          }
        }
        updatedLocalPoll = this.polls[i];
        break;
      }
    };
    return updatedLocalPoll;
  }

  public addOptions(pollId, userId, newOptions) {
    let observable = this.pollBackendService.addOptions(pollId, userId, newOptions, this.socketId)
    .map((response: Response) => {
      const updatedPoll = response.json().response;
      let updatedLocalPoll = null;
      for (let i = 0; i < this.polls.length; i++) {
        if (updatedPoll['_id'] === this.polls[i].pollId) {
          this.polls[i].options = updatedPoll.options;
          updatedLocalPoll = this.polls[i];
          break;
        }
      };
      return updatedLocalPoll;
    });
    return observable;
  }
  
  public createPoll(poll: Poll) {
    let observable = this.getAllPolls()
    .flatMap(() => {
      return this.pollBackendService.createPoll(poll, this.socketId)
    })
    .map((response: Response) => {
      if (response.status === 201) {
        const incomingPoll = response.json().response;
        let newPoll: Poll = this.createLocalPoll(incomingPoll);
        this.polls.push(newPoll);
        return newPoll;
      }
    });
    return observable;
  }

  public deletePoll(pollId: string) {
    let observable = this.pollBackendService.deletePoll(pollId, this.socketId)
    .map((response: Response) => {
      const deletedPollId = response.json().response['_id'];
      let deletedLocalPoll = null;
      for (let i = 0; i < this.polls.length; i++) {
        if (this.polls[i].pollId === deletedPollId) {
          deletedLocalPoll = this.polls.splice(i, 1);
          break;
        }
      }
      if (deletedLocalPoll !== null) {
        return 'Poll was deleted successfully';
      }
      else {
        return 'Poll was deleted on the server, but not on the client. Please reload the page';
      }
    });
    return observable;
  }

  public getPollById(pollId: string) {
    let observable = this.getAllPolls()
    .map(() => {
      let poll = this.filterPollById(pollId);
      return poll;
    });
    return observable;
  }

  private createLocalPoll(serverPoll) {
    return new Poll(
      serverPoll.question,
      serverPoll.options,
      serverPoll.voters,
      serverPoll.creator,
      serverPoll.created,
      serverPoll._id
    );
  }

  private filterPollById(pollId) {
    return this.polls.filter(function(poll) {
      if (poll.pollId === pollId) {
        return poll;
      }
      return null;
    });
  }

}