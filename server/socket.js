var socketIO = require('socket.io'),
  http = require('http'),
  uuid = require('node-uuid'),
  crypto = require('crypto');
fs = require('graceful-fs');


module.exports = function(app) {
  //console.log(process.env.PORT);
  //var server = http.Server(app);

  var server = http.createServer(app);
  server.listen(process.env.PORT || 5000);
  var io = socketIO(server);

  io.on('connection', function(socket) {
    let room_id;
    //console.log('user connected', socket.id);
    //socket.broadcast.emit('offer', socket.id);

    socket.on('save', function(data, fn) {
      fn('get data');
      ////console.log(data);
      fs.writeFile('./dist/resource/' + data.filename + '.json', JSON.stringify(data.data), (err) => {
        if (err) throw err;
        //console.log('The file has been saved!');
      });
    });

    socket.on('leaveRoom', function() {
      socket.leave(room_id); //룸퇴장
      //console.log('OUT ROOM LIST', io.sockets.adapter.rooms);
    });

    socket.on('offer', function(data) {
      //console.log('relaying offer');
      socket.broadcast.to(room_id).emit('offer', data);
    });

    socket.on('answer', function(data) {
      //console.log('relaying answer');
      socket.broadcast.to(room_id).emit('answer', data);
    });

    socket.on('candidate', function(data) {
      //console.log('relaying candidate');
      socket.broadcast.to(room_id).emit('candidate', data);
    });
    //socket.broadcast.emit('new');
  });
};