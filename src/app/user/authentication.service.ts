import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { CanActivate, Router } from '@angular/router';

import { User } from './user.model';

@Injectable()
export class AuthenticationService implements CanActivate {
  private signedInUser;

  // todo: check for existing token and verify whether its still valid
  constructor(private http: Http, private router: Router) {
    this.signedInUser = null;
  }

  signup(user: User) {
    const body = JSON.stringify(user);
    const headers = {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(
      'http://localhost:3000/user/signup',
      body,
      headers)
      .toPromise();
  }

  signin(user: User) {
    let that = this;
    const body = JSON.stringify(user);
    const headers = {
      headers: new Headers ({
        'Content-Type': 'application/json'
      })
    };
    return new Promise((resolve, reject) => {
      that.http.post(
      'http://localhost:3000/user/signin',
      body,
      headers)
      .toPromise()
      .then(function(response) {
        response = response.json();
        response = response['response'];
        localStorage.setItem('token', response['token']);
        that.signedInUser = new User(
          user.email,
          null,
          response['firstName'],
          response['lastName'],
          response['userId']
        );
        resolve(that.signedInUser);
      },
      function(error) {
        reject(error);
      });
    });
  }

  logout() {
    localStorage.clear();
    this.signedInUser = null;
    this.router.navigateByUrl('/dashboard');
  }

  canActivate() {
    if (this.isLoggedIn()) {
      return true;
    }
    else {
      this.router.navigateByUrl('/signin');
      return false;
    }
  }

  // todo validation of token and retrieval of user data
  isLoggedIn() {
    return (localStorage.getItem('token') !== null);
  }

  getUserId() {
    if (this.signedInUser !== null) {
      return this.signedInUser.userId;
    }
    return null;
  }

}
