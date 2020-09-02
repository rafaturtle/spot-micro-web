'use strict'

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
 
var spawn = require('child_process').spawn;
var proc;
 
app.use(express.static('app/'))

app.get('/image_stream.jpg', function(req, res){
  res.sendFile(__dirname + '/stream/image_stream.jpg');
})
 
app.get('/', function(req, res) {
    console.log('Request received:' + __dirname + '/app/index.html')
    res.sendFile(__dirname + '/app/index.html');
});
 
var sockets = {};

io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
    if (proc){
      proc.kill();
    }
    
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});
 
http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}
 
function startStreaming(io) {
 
  if (app.get('watchingFile')) {
    console.log('watching file')
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }
 
  console.log('starting')
  var args = ["-w", "640", "-h", "480", "-o", __dirname + "/stream/image_stream.jpg", "-t", "999999999", "-tl", "50"];
  proc = spawn('raspistill', args);
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile(__dirname + '/stream/image_stream.jpg', function(current, previous) {
    console.log(JSON.stringify(current))
    io.sockets.emit('image_updated', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })
 
}