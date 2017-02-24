import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-poll-creation',
  templateUrl: './poll-creation.component.html',
  styleUrls: ['./poll-creation.component.css']
})

export class PollCreationComponent implements OnInit {
  private pollForm: FormGroup;
  private submitted: boolean;
  private errorMessage: string;

  constructor(private authService: AuthenticationService,
              private pollStore: PollStore,
              private router: Router) {
    this.submitted = false;
    this.errorMessage = null;
  }

  ngOnInit() {
    this.pollForm = new FormGroup({
      'question': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{1}[a-zA-Z0-9 ,]*$/),
        Validators.minLength(5),
        Validators.maxLength(100)
      ]),
      'options': new FormArray([
        this.createOption(),
        this.createOption()
      ],
      this.checkDoubleEntries)
    });
  }

  createOption() {
    return new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9]{1}[a-z-A-Z0-9 ]*$/)
    ]); 
  }

  /* rebuilt without using lodash from:
     https://eyalvardi.wordpress.com/2016/08/28/custom-group-validation-in-angular-2/ */
  checkDoubleEntries(formArray) {
    let valuesGrouped = {};
    let hasDoubleEntries = false;
    for (let i = 0; i < formArray.value.length; i++) {
      let item = formArray.value[i];
      if (item !== null && item !== '') {
        if (valuesGrouped[item]) {
          valuesGrouped[item].push(formArray.controls[i]);
        }
        else {
          valuesGrouped[item] = [formArray.controls[i]];
        }
      }
    }
    for (let item in valuesGrouped) {
      if (valuesGrouped[item].length > 1) {
        hasDoubleEntries = true;
      }
    }
    if (hasDoubleEntries) {
      return {
        'duplicate': 'duplicate entries'
      }
    }
  }

  /* (<FormArray> casting is necessary for TS to accept the push method
      Thank you to Maximlian Schwarzmüller > Udemy > Angular 2 verstehen und anwenden */
  addOption() {
    (<FormArray>this.pollForm.get('options')).push(this.createOption());
  }

  deleteOption(index: number) {
    (<FormArray>this.pollForm.get('options')).removeAt(index);
  }

  /* To dos:
    - message in case of error
    - message for poll-detail component ('This poll was created successfully') */
  onSubmit() {
    let newPoll = new Poll(
      this.pollForm.value.question,
      this.pollForm.get('options').value,
      [],
      this.authService.getUserId()
    );
    this.submitted = true;
    this.errorMessage = null;
    this.pollStore.createPoll(newPoll)
      .then(
        data => {
          this.router.navigateByUrl('/poll/' + data['pollId']);
        },
        error => {
          this.submitted = false;
          this.errorMessage = error.message;
        }
      );
  }
}
