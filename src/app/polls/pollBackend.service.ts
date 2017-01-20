import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/Rx';

import { Poll } from './poll.model';

@Injectable()
export class PollBackendService {

  constructor(private http: Http) { }

  getAllPolls() {
    return this.http.get('http://localhost:3000/poll')
      .toPromise();
  }

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
      .toPromise();
  }

  deletePoll(pollId: string) {
    return this.http.delete('http://localhost:3000/poll/' + pollId)
      .toPromise();
  }

}
