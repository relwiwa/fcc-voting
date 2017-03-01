import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Poll } from '../poll.model';
import { PollsService } from '../polls.service';
import { PollStore } from '../poll-store.service';
import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'poll-add-option',
  templateUrl: './poll-add-option.component.html',
  styleUrls: ['./poll-add-option.component.css']
})

export class PollAddOptionComponent implements OnInit {
  @Input() poll: Poll;
  @Output() editCancelled: EventEmitter<void> = new EventEmitter<void>();
  @Output() editDone: EventEmitter<Poll> = new EventEmitter<Poll>();
  private optionsForm: FormGroup;
  private submitted: boolean;
  private errorMessage: string;
  private userId: string;

  constructor(private authService: AuthenticationService,
              private pollsService: PollsService,
              private pollStore: PollStore) {
    this.submitted = false;
    this.errorMessage = null;
   }

  ngOnInit() {
    this.optionsForm = new FormGroup({
      'newOptions': new FormArray([
        this.pollsService.createOption()
      ],
      this.checkDuplicateAndExistingEntries.bind(this))
    });
    this.userId = this.authService.getUserId();
  }

  /* rebuilt without using lodash from:
     https://eyalvardi.wordpress.com/2016/08/28/custom-group-validation-in-angular-2/
     Functionality:
     - Checks whether user enters duplicate new options
     - Checks whether new option entered by user already exists */
  checkDuplicateAndExistingEntries() {
    if (this.optionsForm !== undefined) {
      let existingOptions = [];
      for (let i = 0; i < this.poll.options.length; i++) {
        existingOptions.push(this.poll.options[i]['value'].toLowerCase());
      }

      let newOptions = this.optionsForm.get('newOptions');
      let newOptionsGrouped = {};
      for (let i = 0; i < newOptions.value.length; i++) {
        let item = newOptions.value[i];
        if (item !== null && item !== '') {
          item = item.toLowerCase();
          if (newOptionsGrouped[item]) {
            newOptionsGrouped[item]++;
          }
          else {
            newOptionsGrouped[item] = 1;
          }
        }
        // set Error 'alreadyExists' if new option already exists
        if (existingOptions.indexOf(item) >= 0) {
          (<FormArray>this.optionsForm.get('newOptions')).controls[i].setErrors({'alreadyExists': true});
        }
      }

      let hasDoubleEntries = this.pollsService.checkForDuplicateOptions(newOptionsGrouped);
      if (hasDoubleEntries) {
        return {
          'duplicate': 'duplicate entries'
        }
      }
    }
  }

  addOption() {
    (<FormArray>this.optionsForm.get('newOptions')).push(this.pollsService.createOption());
  }

  deleteOption(index: number) {
    (<FormArray>this.optionsForm.get('newOptions')).removeAt(index);
    if ((<FormArray>this.optionsForm.get('newOptions')).length === 0) {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editCancelled.emit();
  }

  /* To dos:
    - message in case of error:  show alert with button that emits editDone event */
  onSubmit() {
    let that = this;
    this.pollStore.addOptions(this.poll['pollId'], this.userId, this.optionsForm.get('newOptions').value)
    .subscribe((poll) => {
      that.editDone.emit(poll);
    },
    error => {
      console.log('error happened', error);
      that.editDone.emit(that.poll);
    });
  }

}
