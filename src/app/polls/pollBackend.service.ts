import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/Rx';

import { Poll } from './poll.model';

@Injectable()
export class PollBackendService {

  constructor(private http: Http) { }

  public getAllPolls() {
    return this.http.get('http://localhost:3000/poll')
      .toPromise();
  }

  public createPoll(poll: Poll) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify(poll);
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(
      'http://localhost:3000/poll' + token,
      body,
      headers)
      .toPromise();
  }

  public deletePoll(pollId: string) {
    return this.http.delete('http://localhost:3000/poll/' + pollId + '?token=' + localStorage.getItem('token'))
      .toPromise();
  }

  public vote(pollId, vote) {
    const body = JSON.stringify(vote);
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.patch(
      'http://localhost:3000/poll/' + pollId,
      body,
      headers)
      .toPromise();
  }

  public addOptions(pollId, userId, newOptions) {
    const body = JSON.stringify({
      userId: userId,
      options: newOptions
    });
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(
      'http://localhost:3000/poll/' + pollId + '?token=' + localStorage.getItem('token'),
      body,
      headers)
      .toPromise();
  }


}
