import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';
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

  constructor(private pollStore: PollStore,
              private authService: AuthenticationService) {
    this.submitted = false;
    this.errorMessage = null;
   }

  // todo: custom validator to avoid the same option being entered again
  ngOnInit() {
    this.optionsForm = new FormGroup({
      'newOptions': new FormArray([
        new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[a-zA-Z0-9 ,]+$/)
        ])
      ])
    });
    this.userId = this.authService.getUserId();
  }

  addOption() {
    (<FormArray>this.optionsForm.get('newOptions')).push(new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
      Validators.pattern(/^[a-zA-Z0-9 ,]+$/)
    ]));
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
    - message in case of error */
  onSubmit() {
    let that = this;
    this.pollStore.addOptions(this.poll['pollId'], this.userId, this.optionsForm.get('newOptions').value)
    .then(function(poll: Poll) {
      that.editDone.emit(poll);
    },
    function(error) {
      console.log('error happened', error);
      that.editDone.emit(that.poll);
    });
  }

}
