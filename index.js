'use strict';
var express = require('express');
var path = require("path");
var socket = require('./server/sockets');
/* Start Dev Server */
var app     = express();
console.log(process.env.PORT);
// Serve static assets
//app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.resolve(__dirname, '.', 'public')));

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.', 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  //next(err);
  res.status(404).send('Not found');
});

// app.listen(app.get('port'), function() {
//   console.log("Node app is running at localhost:" + app.get('port'));
// });
socket(app);

// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// app.use(express.static(__dirname + '/dist'));
// app.get('/', function(req, res,next) {
//     res.sendFile(__dirname + '/dist/index.html');
// });

// server.listen(5000);
// io.on('connection', function(client) {
// console.log('Client connected...');
//  //socket code here
// });