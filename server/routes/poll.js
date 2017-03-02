var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');

var validation = require('../utils/validation');

var Poll = require('../models/poll');
var User = require('../models/user');


router.get('/', function(req, res, next) {
  Poll.find()
    .exec(function(err, polls) {
      if (err) {
        return res.status(500).json({
          title: 'An error ocurred: Was not able to get polls'
        });
      }
      res.status(200).json({
        message: 'Retrieval of polls was successful',
        response: polls
      });
    });
});

// Todo: validate id parameter
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

// Respond to CORS-preflight options request
router.options('*', function(req, res, next) {
  res.sendStatus(200);
});

// Route to submit a vote via patch request
router.patch('/:pollId', function(req, res, next) {
  var inputValidation = null;
  var voterObject = {};
  // create values beforehand, so that they can be sent back to client/s
  voterObject['_id'] = mongoose.Types.ObjectId();
  voterObject['voteDate'] = Date.now();
  var pollId = req.params.pollId;
  var optionId = req.body.vote.optionId;
  var voterId = req.body.vote.voterId;
  var socketId = req.body.socketId;
  if (voterId === null) {
    inputValidation = validation.objectIds(pollId, optionId);
  }
  else {
    inputValidation = validation.objectIds(pollId, optionId, voterId);
    voterObject.voterId = voterId;
    voterObject.optionId = optionId
  }
  if (inputValidation === true && socketId !== null) {
    inputValidation = validation.socketIds(socketId);
  }
  if (inputValidation === true) {
    // server-side check missing to insure creator !== voter
    Poll.findOneAndUpdate(
      { '_id': pollId,
        'options._id': optionId },
      { $push: { 'voters': voterObject },
        $inc: { 'options.$.votes': 1 } },
      { new: true },
      function(err, poll) {
        if (err || !poll) {
          return res.status(500).json({
            title: 'An error occurred, the vote was not saved.'
          });
        }
        var resultObject = {
          message: 'Vote was successfully added',
          response: {
            pollId: pollId,
            optionId: optionId,
            newVote: voterObject
          }
        };
        return (function() {
          res.status(200).json(resultObject);
          var socket = req.socketIo.sockets.connected[req.body.socketId];
          if (socket) {
            socket.broadcast.emit('vote-added', resultObject);
          }
        })();
      }
    );
  }
  else {
    return res.status(500).json({
      title: 'The input provided was not valid'
    });
  }
});

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return res.status(401).json({
        title: 'Not authenticated'
      });
    }
    next();
  });
});

// todo: validate data in regard to mongodb injection (maybe not as route is protected)
router.post('/', function(req, res, next) {
  var options = [];
  for (var i = 0; i < req.body.options.length; i++) {
    options.push({
      value: req.body.options[i]
    });
  }
  var newPoll = new Poll({
    question: req.body.question,
    options: options,
    creator: req.body.creatorId
  });
  newPoll.save(function(err, poll) {
    if (err) {
      return res.status(500).json({
        title: 'An error ocurred: Was not able to save new poll'
      });
    }
    return res.status(201).json({
      message: 'New poll was added successfully',
      response: poll
    });
  });
});

// Route to submit new option/s via put request
// Route is protected, input was validated client-side
router.put('/:pollId', function(req, res, next) {
  var pollId = req.params.pollId;
  var userId = req.params.userId;
  var options = [];
  for (var i = 0; i < req.body.options.length; i++) {
    var option = {
      value: req.body.options[i]
    }
    options.push(option);
  }
  Poll.findOneAndUpdate(
    // make sure poll exists and was created by logged in user
    { '_id': pollId,
      'creator._id': userId },
    { $push: { 'options': { $each: options } } },
    { new: true },
    function(err, poll) {
      if (err || !poll) {
        return res.status(500).json({
          title: 'An error occurred, the vote was not saved.'
        });
      }
      return res.status(200).json({
        message: 'Vote was successfully saved',
        response: poll
      });
    }
  );
});

// Todo: validate id parameter
router.delete('/:pollId', function(req, res, next) {
  Poll.findByIdAndRemove(req.params.pollId, function(err, poll) {
      if (err) {
        return res.status(500).json({
          title: 'An error ocurred: Was not able to retrieve this poll'
        });
      }
      if (!poll) {
        return res.status(500).json({
          title: 'An error occurred: No such poll'
        });
      }
      return res.status(200).json({
        message: 'Deletion of poll was successful',
        response: poll
      });
    });
});

module.exports = router;