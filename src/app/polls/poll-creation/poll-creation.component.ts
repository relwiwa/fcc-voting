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
              private pollService: PollStore,
              private router: Router) {
    this.submitted = false;
    this.errorMessage = null;
  }

  ngOnInit() {
    this.pollForm = new FormGroup({
      'question': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9 ,]+$/),
        Validators.minLength(10)
      ]),
      'options': new FormArray([
        new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z0-9 ,]+$/)
        ]),
        new FormControl(null, [
          Validators.required,
          Validators.minLength(2)
        ])
      ])
    });
  }

  /* (<FormArray> casting is necessary for TS to accept the push method
      Thank you to Maximlian Schwarzmüller > Udemy > Angular 2 verstehen und anwenden */
  addOption() {
    (<FormArray>this.pollForm.get('options')).push(new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z0-9 ,]+$/)
    ]));
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
    this.pollService.createPoll(newPoll)
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
