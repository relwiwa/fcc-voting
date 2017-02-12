/*  Setting up MEA2N application following:
    - Angular2 and Node Udemy course by Patrick Schwarzmüller
    - https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli#connecting-component-to-express-api */

// Dependencies
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');

var app = express();

// Mongoose
mongoose.connect(process.env.MONGO_DATABASE);
mongoose.Promise = global.Promise;

// Routes
var appRoutes = require('./server/routes/app');
var pollRoutes = require('./server//routes/poll');
var userRoutes = require('./server/routes/user');

// MIDDLEWARES

// Serve static (Angular2) files from dist folder 
app.use(express.static(path.join(__dirname, 'dist')));

// Parse POST data with bodyparser
app.use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
  extended: false
}));*/

// Ensure CORS works across different servers
// Todo: Specify allowed origin domains here, and only send headers, if req.headers.origin is in whitelist
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// Setup routes
app.use('/poll', pollRoutes);
app.use('/user', userRoutes);
app.use('/', appRoutes);

// 404 handling: send index.html
app.use(function(req, res, next) {
  console.log('404');
  return res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/* SETUP NODE SERVER */

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function(err, res) {
  if (err) {
    console.log('Error happened during server startup');
  }
  else {
    console.log('Server started successfully on port ' + port);
  }
});

module.exports = app;