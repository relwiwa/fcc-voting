import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'poll-results',
  templateUrl: './poll-results.component.html',
  styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit {

  @Input() poll: Poll;
  @Input() userOwnsPoll: boolean;
  private userEditsPoll: boolean;

  constructor(private pollStore: PollStore,
              private router: Router) { }

  ngOnInit() {
    this.userEditsPoll = false;
  }

  deletePoll() {
    let that = this;
    this.pollStore.deletePoll(this.poll.pollId)
    .then(function() {
      // todo: add confirmation message to about to be implemented message component
      that.router.navigateByUrl('/polls');
    },
    function(error) {
      // todo: add error message to about to be implemented message component
      console.log('poll was not deleted', error);
    });
  }

  editPoll() {
    this.userEditsPoll = true;
  }

  editDone(poll) {
    this.poll = poll;
    this.userEditsPoll = false;
  }

}