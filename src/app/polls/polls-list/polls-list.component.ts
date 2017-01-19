import { Component, Input } from '@angular/core';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

@Component({
  selector: 'polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.css']
})

export class PollsListComponent {

  private polls = null;
  @Input() amount: number = null;

  constructor(private pollStore: PollStore) {
    let that = this;
    this.pollStore.getAllPolls()
      .then(function(polls) {
        that.polls = polls;
        if (that.amount !== null) {
          that.polls = that.polls.slice(0, that.amount);
        }
      })
      .catch(function(error) {
        that.polls = [];
      });
   }

}