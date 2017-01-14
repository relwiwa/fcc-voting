import { Component, Input, OnInit } from '@angular/core';

import { Poll } from '../poll.model';

@Component({
  selector: 'app-polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.css']
})

export class PollsListComponent implements OnInit {

  @Input() polls: Poll[] = null;
  @Input() amount: number = null;

  constructor() { }

  public get getAmount() {
    if (this.amount === null) {
      return 10000;
    }
    else {
      return this.amount;
    }
  }

  ngOnInit() {
  }

}
