import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Poll } from '../poll.model';
import { PollStore } from '../pollStore.service';

declare var Chart: any;

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
        dataForChart.labels.push(this.poll.options[i]['value']);
        dataForChart.datasets[0].data.push(votes);  
      }
    }
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: dataForChart
    });
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