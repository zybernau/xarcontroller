var express = require('express');
var app = express();
// var express = require('express.static')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require( 'path' );
// var manager = require('nipplejs');
var pisocks;
var connectedPi = "";


app.use(express.static( __dirname + '/client' ));

app.get('*', function(req, res){
// check for request, if it is initial request send guid
// Else send the apt response
  //res.sendFile(__dirname + '/index.html');

 	res.sendFile( path.join( __dirname, 'client', 'index.html' ));	
 	console.log(path.join( __dirname, 'client', 'index.html' ))
  // app.use( express.static( __dirname + '/client' ));
});


// on connection
io.on('connection', function(socket){
  	console.log(Date().toString() + ': a user connected');

    socket.on('disconnect', function(){
    	console.log(Date().toString() + ': user disconnected');

  	});

    socket.on('init', function(msg){
	    console.log('init message: ' + msg.name);
	    var imsg = {};
	    imsg.name = 'PI-Ran1234';
	    connectedPi = imsg.name;
	    socket.emit('init', imsg);
  	});


    socket.on('piReady', function(msg) {
    	
    	console.log('Ready message: ' + msg.name);
    	pisocks = socket;
    	pisocks.emit('moveForward', msg);
    });

    socket.on('regb', function(msg) {
    	console.log('registered browser: ' + msg.name);
    	msg.name = connectedPi;
    	socket.emit('reg', msg);
    	pisocks.emit('ready',msg);
    });

    socket.on('fd', function(msg) {
    	pisocks.emit('moveForward', msg);
    });

    socket.on('bk', function(msg) {
    	pisocks.emit('moveBackward', msg);
    });


	socket.on('rt', function(msg) {
    	pisocks.emit('turnRight', msg);
    }); 

    socket.on('lt', function(msg) {
    	pisocks.emit('turnLeft', msg);
    });

    socket.on('pl', function(msg) {
    	pisocks.emit('panLeft', msg);
    });

    socket.on('pr', function(msg) {
    	pisocks.emit('panRight', msg);
    });

    socket.on('up', function(msg) {
    	pisocks.emit('panTop', msg);
    });

    socket.on('dn', function(msg) {
    	pisocks.emit('panBottom', msg);
    });



});

io.on('disconnect', function(socket){
  console.log('a user disconnected');
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});