var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

io.on('connection', function(socket){
	
  socket.username = "anonymous";

  socket.emit("request", "createUsername");

  socket.on('user_connect', function(name){
	socket.username = name;
	socket.broadcast.emit('notify',{"from" : socket.username, "notification" : "connected" });
  });
  
  socket.on('message', function(text){
	socket.broadcast.emit('message',{"from" : socket.username, "text":text});
  });
  
  socket.on('disconnect', function(){
	socket.broadcast.emit('notify',{"from" : socket.username, "notification" : "disconnected" });
  });
});

http.listen(process.env.PORT || 8080, function(){
  console.log('listening on *:' + process.env.PORT || 8080);
});
