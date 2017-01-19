import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Poll } from './poll.model';
import { PollBackendService } from './pollBackend.service';


@Injectable()
export class PollStore {
  private polls: Poll[] = null;
  private promise = null;

  constructor(private pollBackendService: PollBackendService) {  }

  public getAllPolls() {
    let that = this;
    if (this.polls === null && this.promise === null) {
      this.promise = new Promise((resolve, reject) => {
        if (that.polls === null) {
          console.log('fetch from server');
          this.pollBackendService.getAllPolls()
          .then(
            function(response) {
              let polls: Poll[] = [];
              response.json().response
              .map((poll: any) => {
                let newPoll = new Poll(
                  poll.question,
                  poll.options,
                  poll.created,
                  poll.creator,
                  poll._id
                );
                polls.push(newPoll);
              });
              that.polls = polls;
              window.setTimeout(function() {
                resolve(that.polls);
              }, 10000);
            })
          .catch(function(error) {
            reject(error);
          });
        }
        else {
          console.log('cached');
          resolve(that.polls);
        }
      });
      return this.promise;
    }
    else {
      return this.promise;
    }
  }

  public getPollById(pollId: string) {
    let that = this;
    var prom = new Promise((resolve, reject) => {
      if (that.polls === null && that.promise !== null) {
        that.promise
          .then(function() {
            resolve(that.filterPollById(pollId));
          });
      }
      else if (that.polls === null && that.promise === null) {
        that.getAllPolls()
          .then(function() {
            resolve(that.filterPollById(pollId));
          });
      }
      else {
        resolve(that.filterPollById(pollId));
      }
    });
    return prom;
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