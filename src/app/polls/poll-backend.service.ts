import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/Rx';

import { Poll } from './poll.model';
import { PollsService } from './polls.service';

@Injectable()
export class PollBackendService {

  private backendUrl: string;

  constructor(private http: Http,
              private pollsService: PollsService) {
    this.backendUrl = this.pollsService.setupBackendUrl();
  }

  public getAllPolls() {
    return this.http.get(this.backendUrl + '/poll');
  }

  public createPoll(poll: Poll, socketId: string) {
    const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
    const body = JSON.stringify({
      poll: poll,
      socketId: socketId
    });
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(
      this.backendUrl + '/poll' + token,
      body,
      headers);
  }

  public deletePoll(pollId: string, socketId: string) {
    return this.http.delete(this.backendUrl + '/poll/' + pollId + '?token=' + localStorage.getItem('token'));
  }

  public vote(pollId, vote, socketId) {
    const body = JSON.stringify({
      'vote': vote,
      'socketId': socketId
    });
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.patch(
      this.backendUrl + '/poll/' + pollId,
      body,
      headers);
  }

  public addOptions(pollId, userId, newOptions, socketId) {
    const body = JSON.stringify({
      userId: userId,
      options: newOptions,
      socketId: socketId
    });
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(
      this.backendUrl + '/poll/' + pollId + '?token=' + localStorage.getItem('token'),
      body,
      headers);
    }

}
