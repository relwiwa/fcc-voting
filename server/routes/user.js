var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/', function(req, res, next) {
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email
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
  res.status(200).json({
    message: 'Route to sign user in'
  });
});

module.exports = router;