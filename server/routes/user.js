var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  res.status(201).json({
    message: 'Route to add user'
  });
});

router.post('/signin', function(req, res, next) {
  res.status(200).json({
    message: 'Route to sign user in'
  });
});

module.exports = router;