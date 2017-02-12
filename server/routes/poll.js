var express = require('express');
var router = express.Router();

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
  var pollId = req.params.pollId;
  var optionId = req.body.optionId;
  var voterId = req.body.voterId;
  if (voterId === null) {
    inputValidation = validation.objectIds(pollId, optionId);
  }
  else {
    inputValidation = validation.objectIds(pollId, optionId, voterId);
    voterObject.voterId = voterId;
    voterObject.optionId = optionId
  }
  // As route is open to public, validate input
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
        return res.status(200).json({
          message: 'Vote was successfully saved',
          poll: poll
        });
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

// todo: validate data in regard to mongodb injection
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
    User.findByIdAndUpdate(
      req.body.creatorId,
      { $push: { 'polls': poll._id } },
      { new: true },
      function (err, user) {
        if (err || !user) {
          return res.status(500).json({
            title: 'An error ocurred. Was not able to add poll to user'
          });
        }
        return res.status(201).json({
          message: 'New poll was added successfully',
          response: poll
        });
      }
    );
  });
});

// Todo: validate id parameter
router.delete('/:pollId', function(req, res, next) {
  Poll.findById(req.params.pollId, function(err, poll) {
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
      poll.remove(function(err, result) {
//        if (err) {
          return res.status(500).json({
            title: 'An error occurred: Was not able to delete this poll'
          });
  /*      }
        else {
          res.status(200).json({
            message: 'Deletion of poll was successful',
            response: poll
          });
        }*/
      });
    })
});

module.exports = router;