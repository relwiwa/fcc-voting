import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollsService } from '../polls.service';
import { PollStore } from '../poll-store.service';

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
              private pollsService: PollsService,
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
        this.pollsService.createOption(),
        this.pollsService.createOption()
      ],
      this.checkDuplicateEntries.bind(this))
    });
  }

  /* rebuilt without using lodash from:
     https://eyalvardi.wordpress.com/2016/08/28/custom-group-validation-in-angular-2/ */
  checkDuplicateEntries() {
    if (this.pollForm) {
      let hasDuplicateEntries = (this.pollsService.hasDuplicateEntries(this.pollForm.get('options')));
      if (hasDuplicateEntries) {
        return {
          'duplicate': 'duplicate entries'
        }
      }
    }
  }

  /* (<FormArray> casting is necessary for TS to accept the push method
      Thank you to Maximlian Schwarzmüller > Udemy > Angular 2 verstehen und anwenden */
  addOption() {
    (<FormArray>this.pollForm.get('options')).push(this.pollsService.createOption());
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
    .subscribe(
      newPoll => {
        this.router.navigateByUrl('/poll/' + newPoll['pollId']);
      },
      error => {
        this.submitted = false;
        this.errorMessage = 'An error happened. Your poll was not saved';
      }
    );
  }
}
