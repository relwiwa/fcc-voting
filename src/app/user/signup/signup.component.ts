import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { User } from '../user.model';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted: boolean;
  signupSuccess: boolean;

  constructor(public authService: AuthenticationService) {
    this.submitted = false;
    this.signupSuccess = null;
  }

  // Email RegExp from http://emailregex.com
  ngOnInit() {
    this.signupForm = new FormGroup({
    firstName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(8)
      ])
    });
  }

  resetForm() {
    this.signupForm.reset();
  }

  reeditForm() {
    this.submitted = false;
    this.signupSuccess = null;
  }

  // todo: frontend encryption
  // todo: replace signupSuccess with reference to promise
  onSubmit() {
    let that = this;
    let newUser = new User(
      this.signupForm.value.email,
      this.signupForm.value.password,
      this.signupForm.value.firstName,
      this.signupForm.value.lastName
    );
    this.submitted = true;
    this.authService.signup(newUser)
      .then(function(response) {
        that.signupSuccess = true;
      },
      function(error) {
        that.signupSuccess = false;
      }
      );
  }

}
