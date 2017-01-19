import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'app-poll-creation',
  templateUrl: './poll-creation.component.html',
  styleUrls: ['./poll-creation.component.css']
})

export class PollCreationComponent implements OnInit {
  poll: Poll = null;

  constructor(private pollService: PollStore, private router: Router) { }

  ngOnInit() {
    this.poll = new Poll('', ['', ''], null, null);
  }

  addOption() {
    this.poll.options.push("");
  }

  /* To dos:
    - input validation
    - message in case of error
    - message for poll-detail component ('This poll was created successfully') */
  onSubmit(form: NgForm) {
    let pollOptions = [];
    this.poll.question = form.value.question;
    for (var i = 0; i < this.poll.options.length; i++) {
      if (form.value['option' + i] !== '') {
        pollOptions.push(form.value['option' + i]);
      }
    }
    this.poll.options = pollOptions;
    this.poll.creatorId = 'DummyId';
    this.pollService.createPoll(this.poll)
      .then(
        data => {
          this.router.navigateByUrl('/poll/' + data['pollId']);
        },
        error => console.log(error)
      );
  }

}
