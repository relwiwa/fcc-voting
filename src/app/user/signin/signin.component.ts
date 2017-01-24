import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';
import { User } from '../user.model';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  private signinForm: FormGroup;
  private submitted: boolean;
  private errorMessage: string;

  constructor(private authService: AuthenticationService, private router: Router) { 
    this.submitted = false;
    this.errorMessage = null;
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])
    });
  }

  resetForm() {
    this.signinForm.reset();
  }

  onSubmit() {
    let that = this;
    let signinUser = new User(
      this.signinForm.value.email,
      this.signinForm.value.password
    );
    this.submitted = true;
    this.errorMessage = null;
    this.authService.signin(signinUser)
      .then(function(response) {
        localStorage.setItem('token', response['token']);
        localStorage.setItem('userId', response['userId']);
        localStorage.setItem('firstName', response['firstName']);
        localStorage.setItem('lastName', response['lastName']);
        that.router.navigateByUrl('/dashboard');
      },
      function(error) {
        that.submitted = false;
        that.signinForm.reset();
        if (error.status === 401) {
          that.errorMessage = 'The login credentials you provided were not correct. Please try again.';
        }
        else {
          that.errorMessage = 'There was a server-side problem. Signin was not possible. Please try again or contact our support.';
        }
      }
      );
  }

}
