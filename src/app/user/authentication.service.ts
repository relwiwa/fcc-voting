import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { CanActivate, Router } from '@angular/router';

import { User } from './user.model';

@Injectable()
export class AuthenticationService implements CanActivate {

  constructor(private http: Http, private router: Router) { }

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
    const body = JSON.stringify(user);
    const headers = {
      headers: new Headers ({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(
      'http://localhost:3000/user/signin',
      body,
      headers)
      .toPromise();
  }

  logout() {
    localStorage.clear();
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

  isLoggedIn() {
    return (localStorage.getItem('token') !== null);
  }

}
