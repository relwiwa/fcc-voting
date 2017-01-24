var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/signup', function(req, res, next) {
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  newUser.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        message: 'An error occurred: Signup was not successful'
      });
    }
    else {
      return res.status(201).json({
        message: 'Signup was successful',
        response: result
      });
    }
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
    else if (!user || (user.password !== req.body.password)) {
      return res.status(401).json({
        message: 'Login failed due to invalid login credentials'
      });
    }
    else {
      res.status(200).json({
        message: 'Signin was successful',
        token: 'token',
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  });
});

module.exports = router;