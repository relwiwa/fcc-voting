import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../poll-store.service';

import * as Chart from 'chart.js';

//declare var Chart: any;

@Component({
  selector: 'poll-results',
  templateUrl: './poll-results.component.html',
  styleUrls: ['./poll-results.component.css']
})

export class PollResultsComponent implements AfterViewInit, OnInit {

  @Input() poll: Poll;
  @Input() userOwnsPoll: boolean;
  private userEditsPoll: boolean;
  private myChart;

  constructor(private pollStore: PollStore,
              private router: Router) {
    this.myChart = null;
  }

  ngOnInit() {
    this.userEditsPoll = false;
    if (this.poll.voters.length > 0) {
      this.sortOptions();
    }
  }

  ngAfterViewInit() {
    if (this.poll.voters.length > 0) {
      this.sortOptions();
      this.createChart();
    }
  }

  sortOptions() {
    this.poll.options.sort(function(a, b) {
      return b['votes'] - a['votes'];
    });
  }

  createChart() {
    Chart.defaults.global.defaultFontSize = 14;
    Chart.defaults.global.legend.display = true;
    Chart.defaults.global.legend.position = 'bottom';
    Chart.defaults.global.tooltips.displayColors = false;
    var ctx = document.getElementById("myChart");
    var dataForChart = {
        labels: [],
        datasets: [{
            data: [],
            hoverBackgroundColor: '#5bc0de'
        }]
    };
    for (let i = 0; i < this.poll.options.length; i++) {
      let votes = this.poll.options[i]['votes'];
      if (votes > 0) {
        let label = this.poll.options[i]['value'];
        if (label.length > 25) {
          label = label.substr(0, 25) + '...';
        }
        dataForChart.labels.push(label);
        dataForChart.datasets[0].data.push(votes);  
      }
    }
    this.myChart = new Chart(ctx, {
        type: 'pie',
        data: dataForChart
    });
  }

  deletePoll() {
    let that = this;
    this.pollStore.deletePoll(this.poll.pollId)
    .subscribe(() => {
      console.log('Poll was deleted successfully');
      // todo: add confirmation message to about to be implemented message component
      that.router.navigateByUrl('/polls');
    },
    error => {
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