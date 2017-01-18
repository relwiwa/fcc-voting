import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Poll } from './poll.model';
import { PollBackendService } from './pollBackend.service';


@Injectable()
export class PollStore {
  private polls: Poll[] = null;

  constructor(private pollBackendService: PollBackendService) {  }

  public getAllPolls() {
    let that = this;
    let prom = new Promise((resolve, reject) => {
      if (that.polls === null) {
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
            resolve(that.polls);
          })
        .catch(function(error) {
          reject(error);
        });
      }
      else {
        resolve(that.polls);
      }
    });
    return prom;
  }

}