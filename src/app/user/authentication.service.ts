import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { CanActivate, Router } from '@angular/router';

import { User } from './user.model';

@Injectable()
export class AuthenticationService implements CanActivate, OnInit {
  private signedInUser;
  
  constructor(private http: Http, private router: Router) {
    this.signedInUser = null;
  }

  ngOnInit() {
    this.isSignedIn();
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
        localStorage.setItem('userId', response['userId']);
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.signedInUser = null;
    this.router.navigateByUrl('/dashboard');
  }

  canActivate() {
    if (this.isSignedIn()) {
      return true;
    }
    else {
      this.router.navigateByUrl('/signin');
      return false;
    }
  }

  isSignedIn() {
    if (this.signedInUser === null) {
      let token = localStorage.getItem('token');
      let userId = localStorage.getItem('userId');
      if (token === null) {
        this.signedInUser = null;
        return false;
      }
      else {
        this.signedInUser = new User(null, null, null, null, userId);
        return true;
      }
    }
    return true;
  }

  getUserId() {
    if (this.signedInUser !== null) {
      return this.signedInUser.userId;
    }
    return null;
  }

}
