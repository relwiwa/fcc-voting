var express = require('express');
var router = express.Router();

var Poll = require('../models/poll');

router.get('/', function(req, res, next) {
  Poll.find()
    .exec(function(err, polls) {
      if (err) {
        return res.status(500).json({
          title: 'An error ocurred: Was not able to get polls'
        });
      }
      else {
        res.status(200).json({
          message: 'Retrieval of polls was successful',
          response: polls
        });
      }
    })
});

/* router.get('/:pollId', function(req, res, next) {
  Poll.find({'_id': req.params.pollId})
    .exec(function(err, poll) {
      if (err) {
        return res.status(500).json({
          title: 'An error ocurred: Was not able to get this poll'
        });
      }
      else {
        res.status(200).json({
          message: 'Retrieval of poll was successful',
          response: poll
        });
      }
    })
});*/


router.post('/', function(req, res, next) {
  var options = [];
  for (var i = 0; i < req.body.options.length; i++) {
    options.push({
      value: req.body.options[i]
    });
  }
  var poll = new Poll({
    question: req.body.question,
    options: options,
    creator: req.body.creatorId    
  });
  poll.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error ocurred: Was not able to save new poll'
      });
    }
    else {
      res.status(201).json({
        message: 'New poll was added successfully',
        response: result
      });
    }
  });
});

router.patch('/:id', function(req, res, next) {
  res.status(200).json({
    message: 'Route to update a poll with id ' 
    + req.params.id
  });
});

router.delete('/:id', function(req, res, next) {
  res.status(200).json({
    message: 'Route to delete a poll with id ' + req.params.id
  });
});

module.exports = router;