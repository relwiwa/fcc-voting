import { Component, Input } from '@angular/core';

import { Poll } from '../poll.model';
import { PollStore } from '../poll-store.service';

@Component({
  selector: 'polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.css']
})

export class PollsListComponent {

  polls = null;
  @Input() amount: number = null;

  constructor(public pollStore: PollStore) {
    let that = this;
    this.pollStore.getAllPolls()
      .subscribe(
        polls => {
          that.polls = polls;
          if (that.amount !== null) {
            that.polls = that.polls.slice(0, that.amount);
          }
        },
        error => {
          that.polls = [];
        }
      );
   }

}