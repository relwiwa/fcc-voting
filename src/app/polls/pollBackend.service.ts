import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/Rx';

import { Poll } from './poll.model';

@Injectable()
export class PollBackendService {

  private backendUrl: string;

  constructor(private http: Http,
              private router: Router) {
    this.setupBackendUrl();
  }

  private setupBackendUrl() {
    if (window.location.hostname === 'localhost') {
      this.backendUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
    }
    else {
      this.backendUrl = window.location.origin; 
    }
  }

  public getAllPolls() {
    return this.http.get(this.backendUrl + '/poll')
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
      this.backendUrl + '/poll' + token,
      body,
      headers)
      .toPromise();
  }

  public deletePoll(pollId: string) {
    return this.http.delete(this.backendUrl + '/poll/' + pollId + '?token=' + localStorage.getItem('token'))
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
      this.backendUrl + '/poll/' + pollId,
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
      this.backendUrl + '/poll/' + pollId + '?token=' + localStorage.getItem('token'),
      body,
      headers)
      .toPromise();
  }

}
