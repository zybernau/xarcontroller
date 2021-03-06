
	// main.js
	// nipple implementation start

	var mgrjstkcar;
	var mgrjsrkcam;
	$( document ).ready(function() {
		console.log( "ready!" );
	    
	    	var options = {
		// zone: $('#zonejtick1'),
		zone: document.getElementById('zonejtick1'),
		multitouch: true,
		maxNumberOfNipples: 2,
		mode: 'static',
		position: {left: '25%', top: '50%'},
	    color: 'red'
		};
		mgrjstkcar= nipplejs.create(options);

		var options2 = {
		// zone: $('#zonejtick1'),
		zone: document.getElementById('zonejtick2'),
		multitouch: true,
		maxNumberOfNipples: 1,
		mode: 'static',
		position: {left: '25%', top: '50%'},
	    color: 'blue'
		};
		mgrjsrkcam= nipplejs.create(options2);

		// event registration

		// Car events 
		// Move front, back, stop
		// turn right, left, stop
		// turn right/left, forward, stop
		// turn right/left, backward, stop

		// mgrjstkcar.on('added', function (evt, nipple) {
	 //    nipple.on('start move end dir plain', function (evt) {
	 //        // DO EVERYTHING
	 //        console.log("event triggered.");
	 //        Forward();
	 //        Right();
	 //    });
		// }).on('removed', function (evt, nipple) {
		//     nipple.off('start move end dir plain');
		// });

		mgrjstkcar.on('start end', function(evt, data) {
		    //dump(evt.type);
		    //debug(data);
		    console.log("started. data=>" + data);
		    if(!deviceReady) {
		    	return false;
		    }
		    socket.emit('stp', reg);
		  }).on('move', function(evt, data) {
		    //debug(data);
		    console.log("moved. Data=> " + data);
		    if(!deviceReady) {
		    	return false;
		    }
    	    if(data.direction.angle === "up") {
		    	if(data.angle.degree > 90) {
					socket.emit('fd', reg);
					socket.emit('rt',reg);
		    	}
		    	if(data.angle.degree < 90) {
		    		socket.emit('fd', reg);
					socket.emit('lt',reg);
		    	}
		    } else if (data.direction.angle === "down")  {
		    	if(data.angle.degree > 90) {
					socket.emit('bk', reg);
					socket.emit('rt',reg);
		    	}
		    	if(data.angle.degree < 90) {
		    		socket.emit('bk', reg);
					socket.emit('lt',reg);
		    	}
		    } else if (data.direction.angle === "right")  {
		    	socket.emit('rt',reg);
		    } else if (data.direction.angle === "left")  {
		    	socket.emit('lt',reg);
		    }
		  }).on('dir:up plain:up dir:left plain:left dir:down ' +
		        'plain:down dir:right plain:right',
		        function(evt, data) {
		    //dump(evt.type);
		    console.log("direction changed");
		  }
		       ).on('pressure', function(evt, data) {
		       	if(!deviceReady) {
		    		return false;
			    }
			    reg.speed = 90;
			    socket.emit('stp', reg);
		    	console.log("pressure is on => " + data);
		  });


	});


	// nipple implementation end.


	var socket = io();

	var reg = {};
	reg.name = "xar controller UI";

	var deviceReady = false;
	socket.on('reg', function(msg) {
		console.log('got the message from server: ' + msg.name);
		$('#deviceId').text(msg.name);
		deviceReady = msg.deviceReady;
	});

	function registerWithServer() {
		// send socket signal to register with the server.
		
		socket.emit('regb', reg);

	}

	function Forward() {
		socket.emit('fd', reg);
	}

	function Backward() {
		socket.emit('bk', reg);
	}

	function Right() {
		socket.emit('rt',reg);
	}

	function Left() {
		socket.emit('lt',reg);
	}

	function PanUp() {
		socket.emit('up',reg);
	}

	function PanDown() {
		socket.emit('dn',reg);
	}

	function PanRight() {
		socket.emit('pr',reg);
	}

	function PanLeft() {
		socket.emit('pl',reg);
	}
