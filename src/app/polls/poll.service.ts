import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Poll } from './poll.model';

@Injectable()
export class PollService {
  private polls: Poll[] = [];

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
      const result = response.json();
      return result;
      /*const poll = new Poll(
        result.obj.question,
        result.obj.options,
        result.obj.created,
        result.obj.creator._id,
        result.obj._id
      );
      this.polls.push(poll);
      return poll;*/
    })
    .catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  getPolls() {
    return this.http.get('http://localhost:3000/poll')
    .map((response: Response) => {
      const polls = response.json().obj;
      let transformedPolls: Poll[] = [];
      for (let poll of polls) {
        transformedPolls.push(
          new Poll(
            poll.question,
            poll.options,
            poll.created,
            poll.creator._id,
            poll._id
          )
        );
        this.polls = transformedPolls;
        return transformedPolls;
      }
    })
    .catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

}
