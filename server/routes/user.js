var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/user');

// todo: use native crypto module
router.post('/signup', function(req, res, next) {
  var rounds = 10;
  bcrypt.hash(req.body.password, rounds)
  .then(function(sltdHshdPassword) {
    var newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: sltdHshdPassword,
      encRounds: rounds
    });
    newUser.save()
    .then(function(result) {
      return res.status(201).json({
        message: 'Signup was successful'
      });
    });
  })
  .catch(function(error) {
    return res.status(500).json({
      message: 'An error occurred: Signup was not successful'
    });
  })
});

router.post('/signin', function(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        message: 'An error occurred: Signin was not possible'
      });
    }
    else if (!user) {
      return res.status(401).json({
        message: 'Login failed due to invalid login credentials'
      });
    }
    else {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err || result === false) {
          return res.status(401).json({
            message: 'Login failed due to invalid login credentials'
          });
        }
        else {
          res.status(200).json({
            message: 'Signin was successful',
            response: {
              token: 'token',
              userId: user._id,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        }
      });
    }
  });
});

module.exports = router;