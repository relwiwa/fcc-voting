import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Poll } from './poll.model';

@Injectable()
export class PollService {
  private polls: Poll[] = null;

  constructor(private http: Http) { }

  createPoll(poll: Poll) {
    const body = JSON.stringify(poll);
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(
      'http://localhost:3000/poll',
      body,
      headers)
    .map((response: Response) => {
      const result = response.json().response;
      const poll = new Poll(
        result.question,
        result.options,
        result.created,
        result.creator, // todo: replace with creator._id
        result._id 
      );
      this.polls.push(poll);
      return poll;
    })
    .catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  getPolls() {
    if (this.polls !== null) {
      console.log('returned Observable.of');
      return Observable.of(this.polls);
    }
    else {
      return this.http.get('http://localhost:3000/poll')
      .map((response: Response) => {
        const polls = response.json().response;
        let transformedPolls: Poll[] = [];
        for (let poll of polls) {
          transformedPolls.push(
            new Poll(
              poll.question,
              poll.options,
              poll.created,
              poll.creator,
              poll._id
            )
          );
        }
        this.polls = transformedPolls;
        return transformedPolls;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
    }
  }

  getPollById(pollId) {
    return this.polls.filter(function(poll) {
      if (poll.pollId === pollId) {
        return poll;
      }
    });
  }

}
