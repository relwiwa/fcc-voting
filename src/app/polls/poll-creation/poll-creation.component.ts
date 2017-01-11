import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Poll } from '../poll.model';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-creation',
  templateUrl: './poll-creation.component.html',
  styleUrls: ['./poll-creation.component.css']
})

export class PollCreationComponent implements OnInit {
  poll: Poll = null;

  constructor(private pollService: PollService) { }

  ngOnInit() {
    this.poll = new Poll('', ['', ''], null, null);
  }

  addOption() {
    this.poll.options.push("");
  }

  onSubmit(form: NgForm) {
    this.poll.question = form.value.question;
    for (var i = 0; i < this.poll.options.length; i++) {
      if (form.value['option' + i] !== '') {
        this.poll.options[i] = form.value['option' + i];
      }
    }
    this.pollService.createPoll(this.poll)
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    this.poll = new Poll('', ['', ''], null, null);
    form.resetForm();
  }

}
