import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Poll } from './poll.model';
import { PollBackendService } from './pollBackend.service';


@Injectable()
export class PollStore {
  private polls: Poll[] = null;
  private promise = null;
  private currentPoll: Poll;

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
                poll.voter,
                poll.creator,
                poll.created,
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

  public vote(pollId, vote) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.pollBackendService.vote(pollId, vote)
        .then(function(response) {
          let poll = response.json();
          poll = poll.poll;
          that.currentPoll = new Poll(
            poll.question,
            poll.options,
            poll.voter,
            poll.creator,
            poll.created,
            poll._id
          );
          resolve(that.currentPoll);
        },
        function(error) {
          reject(error);
        });
    });
  }

  public getPollById(pollId: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (that.polls === null && that.promise !== null) {
        that.promise
          .then(function() {
            resolve(that.filterPollById(pollId));
          },
          function(error) {
            reject({
              'message': 'Error in backend, poll was not found'
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
              'message': 'Error in backend, poll was not found'
            });
          });
      }
      else {
        resolve(that.filterPollById(pollId));
      }
    });
  }

  public createPoll(poll: Poll) {
    let that = this;
    return new Promise((resolve, reject) => {
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
                  response['voter'],
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
  }

  public deletePoll(pollId: string) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.pollBackendService.deletePoll(pollId)
        .then(function(response) {
          response = response.json();
          let deletedPoll = null;
          for (var i = 0; i < that.polls.length; i++) {
            if (that.polls[i].pollId === response['response']['_id']) {
              deletedPoll = that.polls.splice(i, 1);
              break;
            }
          }
          if (deletedPoll !== null) {
            resolve(deletedPoll);
          }
          else {
            reject({
              'message': 'Poll was deleted in backend, but not in frontend'
            });
          }
        },
        function(error) {
          reject({
            'message': 'Error in backend, poll was not deleted'
          });
        });
    });
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