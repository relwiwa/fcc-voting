import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-creation',
  templateUrl: './poll-creation.component.html',
  styleUrls: ['./poll-creation.component.css']
})

export class PollCreationComponent implements OnInit {
  poll: Poll = null;

  constructor(private pollService: PollService, private router: Router) { }

  ngOnInit() {
    this.poll = new Poll('', ['', ''], null, null);
  }

  addOption() {
    this.poll.options.push("");
  }

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
      .subscribe(
        data => {
          this.router.navigateByUrl('/poll/' + data.pollId);
        },
        error => console.log(error)
      );
//    this.poll = new Poll('', ['', ''], null, null);
//    form.resetForm();

  }

}
