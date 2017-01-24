import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { User } from './user.model';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(
      'http://localhost:3000/user',
      body,
      headers)
      .toPromise();
  }

}
