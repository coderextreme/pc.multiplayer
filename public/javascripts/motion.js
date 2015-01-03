	var socket = io();
	var players = [];
	var thisplayer = -1;
	var oldev = [0,0,0];
	function move(event) {
		socket.emit('clientmove', event,[0,-1,0]);
		oldev = event;
	}
