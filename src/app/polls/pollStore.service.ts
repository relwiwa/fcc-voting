import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Poll } from './poll.model';
import { PollBackendService } from './pollBackend.service';


@Injectable()
export class PollStore {
  private polls: Poll[] = null;
  private promise = null;

  constructor(private pollBackendService: PollBackendService) {  }

  public getAllPolls() {
    let that = this;
    if (this.promise === null) {
      this.promise = new Promise((resolve, reject) => {
        this.pollBackendService.getAllPolls()
          .then(function(response) {
            let polls: Poll[] = [];
            response.json().response
            .map((poll: any) => {
              let newPoll = new Poll(
                poll.question,
                poll.options,
                poll.created,
                poll.creator,
                poll._id
              );
              polls.push(newPoll);
            });
            that.polls = polls;
//            window.setTimeout(function() {
              resolve(that.polls);
  //          }, 5000);
          },
          function(error) {
            reject(error);
          });
      });
      return this.promise;
    }
    else {
      return this.promise;
    }
  }

  public getPollById(pollId: string) {
    let that = this;
    var prom = new Promise((resolve, reject) => {
      if (that.polls === null && that.promise !== null) {
        that.promise
          .then(function() {
            resolve(that.filterPollById(pollId));
          },
          function(error) {
            reject({
              'message': 'Error in backend, poll was not added'
            });
          });
      }
      else if (that.polls === null && that.promise === null) {
        that.getAllPolls()
          .then(function() {
            resolve(that.filterPollById(pollId));
          },
          function(error) {
            reject({
              'message': 'Error in backend, poll was not added'
            });
          });
      }
      else {
        resolve(that.filterPollById(pollId));
      }
    });
    return prom;
  }

  public createPoll(poll: Poll) {
    let that = this;
    let prom = new Promise((resolve, reject) => {
      that.getAllPolls()
        .then(function() {
          that.pollBackendService.createPoll(poll)
            .then(function(response) {
              response = response.json();
              if (response['response']) {
                response = response['response'];
                let newPoll = new Poll(
                  response['question'],
                  response['options'],
                  response['created'],
                  response['creator'],
                  response['_id']
                );
                that.polls.push(newPoll);
                resolve(newPoll);
              }
              else {
                reject({
                  'message': 'Poll was not created successfully'
                });
              }
            },
            function(error) {
              reject({
                'message': 'Poll was not created successfully'
              });
            });
        },
        function(error) {
          reject({
            'message': 'Error in backend, poll was not added'
          });
        });
    });
    return prom;
  }

  private filterPollById(pollId) {
    return this.polls.filter(function(poll) {
      if (poll.pollId === pollId) {
        return poll;
      }
      return null;
    });
  }


}