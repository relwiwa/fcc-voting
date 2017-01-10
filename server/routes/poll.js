var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'Route to get all polls'
  });
});

router.post('/', function(req, res, next) {
  res.status(201).json({
    message: 'Route to add new poll'
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