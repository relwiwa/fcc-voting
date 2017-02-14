import { Component, Input, OnInit } from '@angular/core';

import { Poll } from '../poll.model';

@Component({
  selector: 'poll-results',
  templateUrl: './poll-results.component.html',
  styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit {

  @Input() poll: Poll;
  @Input() userOwnsPoll: boolean;

  constructor() { }

  ngOnInit() {

  }

  deletePoll() {
    console.log('delete poll');
  }

  editPoll() {
    console.log('edit poll');
  }

}
