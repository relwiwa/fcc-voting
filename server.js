/*  Setting up MEA2N application following:
    - Angular2 and Node Udemy course by Patrick Schwarzmüller
    - https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli#connecting-component-to-express-api */

// Require and setup Express, Server, Socket.io
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var port = process.env.PORT || '3000';
var socketIo = require('socket.io')();

// Dependencies
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var mongoose = require('mongoose');
var path = require('path');


// Mongoose
mongoose.connect(process.env.MONGO_DATABASE);
mongoose.Promise = global.Promise;

// Routes
var appRoutes = require('./server/routes/app');
var pollRoutes = require('./server//routes/poll');
var userRoutes = require('./server/routes/user');

// MIDDLEWARES

// Attach socket.io to req-object
// http://verwebbt.de/2014/11/30/socket-io-in-an-express-app/
app.use(function(req, res, next) {
  req.socketIo = socketIo;
  next();
});

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

app.set('port', port);

socketIo.on('connection', function(client) {
  console.log('Client connected...');
  client.emit('connected', {
    'message': 'socket.io connection was successfully established',
    'socketId': client.id
  });
  client.broadcast.emit('intro', 'someone else joined');
});

server.listen(port, function(err, res) {
  if (err) {
    console.log('Error happened during server startup');
  }
  else {
    console.log('Server started successfully on port ' + port);
  }
});

socketIo.listen(server);

module.exports = app;