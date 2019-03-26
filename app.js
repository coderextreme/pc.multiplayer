var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var metaServer = "https://salty-beyond-41854.herokuapp.com";
var Client = require('node-rest-client-patched').Client;
var client = new Client();
app.use(express.static(__dirname + '/public'));
var router = express.Router();
var cardsTaken = {};
router.route('/servers')
        .get(function(req, res) {
			// console.log(res);
		try {
			client.get(metaServer+"/api/servers/", function(gameServers, response){
				console.log(gameServers);
				res.json(JSON.parse(gameServers));
			});
		} catch (e) {
			console.log(e);
		}
        });
app.use('/api', router);


function Multiplayer() {
}

var maxplayers = 0;
var players = {};
var oldplayers = {};

function reportPlayers(socket) {
	var numPlayers = 0;
	for (var p in players) {
		numPlayers++;
	}
	io.emit('servermessage', "The dwelling has "+numPlayers+" resident"+(numPlayers > 1 ? "s." : "."));
	var uri = socket.handshake.headers.referer;
	if (typeof uri !== 'undefined') {
		var hostIndex = uri.indexOf("//")+2;
		var trailing = uri.indexOf("/", hostIndex)-hostIndex;
		var hostport = uri.substr(hostIndex, trailing);
		var portIndex = -1;
		portIndex = hostport.indexOf(":");
		var host = "localhost";
		var port = 51000;
		if (portIndex >= 0) {
			host = hostport.substr(0, portIndex);
			port = hostport.substr(portIndex+1);
		} else {
			host = hostport;
			port = 80;
		}
		var args = { path:{"host": host, port: port, players: numPlayers}};
		try {
			client.get(metaServer+"/api/servers/${host}/${port}/${players}", args, function(data, response){
				console.log(data);
				console.log(response);
			});
		} catch (e) {
			console.log(e);
		}
	}
}

Multiplayer.prototype = {
	clientmessage: function(socket, msg) {
		io.emit('servermessage', "<"+players[socket.client.id].playernumber+"> "+msg[0]);
	},
	clientmove: function(socket, position, orientation) {
		console.log(position);
		console.log(orientation);
		if (typeof orientation[0] === 'string') {
			if (orientation[0] === 'card52') {
				var card = Multiplayer.prototype.deal(1);
				socket.emit('serverdeal', card);
				for (var cardpicked in card) {
					players[socket.client.id].cards[cardpicked] = true;
				}
			} else {
				delete cardsTaken[orientation[0].substr(4)];
				delete players[socket.client.id].cards[orientation[0].substr(4)];
			}
			console.log('returned', orientation[0].substr(4));
		}
		if (typeof players[socket.client.id].position !== 'undefined') {
			var newposition = position;
			var oldposition = players[socket.client.id].position;
			var delta = [newposition[0] - oldposition[0], 
				newposition[1] - oldposition[1], 
				newposition[2] - oldposition[2]];
			var distance = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1]+delta[2]*delta[2]);
			if (distance > 1) { // maximum distance player can travel
				delta = [delta[0]/distance, delta[1]/distance, delta[2]/distance];
				players[socket.client.id].position = [oldposition[0]+delta[0],
					oldposition[1]+delta[1],
					oldposition[2]+delta[2]];
			} else {
				players[socket.client.id].position = newposition;
			}
			players[socket.client.id].orientation = orientation;
		} else {
			players[socket.client.id].position = [0,0,0];
			players[socket.client.id].orientation = orientation;
		}
		console.log('serverupdate', players[socket.client.id].playernumber, players[socket.client.id].position, players[socket.client.id].orientation);
		io.emit('serverupdate', players[socket.client.id].playernumber, players[socket.client.id].position, players[socket.client.id].orientation);
		function close(v1, v2) {
			return Math.abs(v1 - v2) < 0.01;
		}
		function inRange(p1, p2) {
			return (close(p1.position[0], p2.position[0]) &&
				close(p1.position[1], p2.position[1]) &&
				close(p1.position[2], p2.position[2]));
		}
		for (var player in players) {
			// test collisions
			if (player != socket.client.id) {
				if (typeof players[player].position !== 'undefined') {
					// player has moved
					if (inRange(players[player], players[socket.client.id])) {
						// reset to beginning
						players[player].position = [0,0,0];
						players[socket.client.id].score++;
						if (typeof orientation[0] === 'number') {
							console.log('serverupdate', players[player].playernumber, players[player].position, players[player].orientation);
							io.emit('serverupdate', players[player].playernumber, players[player].position, players[player].orientation);
						}
						io.emit('serverscore', players[socket.client.id].playernumber, players[socket.client.id].score);
					}
				}
			}
		}
	},
	clientshoot: function() {console.log(arguments);},
	clientslash: function() {console.log(arguments);},
	clientpowerplay: function() {console.log(arguments);},
	clientcounter: function() {console.log(arguments);},
	clientquit: function() {console.log(arguments);},
	clientturnbegin: function() {console.log(arguments);},
	clientturnend: function() {console.log(arguments);},
	clientrejoin: function(socket, msg) {
		var i = msg[0].indexOf("?");
		if (i >= 0) {
			var id = msg[0].substring(i+1);
			if (typeof oldplayers[id] !== 'undefined') {
				players[socket.client.id] = { playernumber: oldplayers[id].playernumber, id: socket.client.id, score: oldplayers[id].score };
				//socket.emit('servermessage', 'Your previous id was '+id);
				//socket.emit('servermessage', 'Your current id is '+socket.client.id);
				console.log(players[socket.client.id]);
				io.emit('servermessage', players[socket.client.id].playernumber+" joined.");
				reportPlayers(socket);
				socket.emit('servercapability', players[socket.client.id], players[socket.client.id].playernumber);
				console.log('dealing...');
				players[socket.client.id].cards = Multiplayer.prototype.deal(7);
				socket.emit('serverdeal', players[socket.client.id].cards);
			} else {
				Multiplayer.prototype.clientjoin(socket);
			}
		} else {
			Multiplayer.prototype.clientjoin(socket);
		}
	},
	deal: function(cards) {
		var hand = {};
		var ct = 0;
		for (var c in cardsTaken) {
			if (cardsTaken.hasOwnProperty(c)) {
				ct++;
			}
		}
		if (cards > 52 - ct) {
			cards = 52 - ct;  // reduce cards to number in talon
		}
		for (var crd = 0; crd < cards; crd++) {
			var cardpicked;
			do {
				cardpicked = Math.floor(Math.random()*52);
			} while (cardsTaken[cardpicked]);
			cardsTaken[cardpicked] = true;
			hand[cardpicked] = true;
		}
		console.log('dealing', hand);
		return hand;
	},
	clientjoin: function(socket) {
		players[socket.client.id] = {playernumber: maxplayers, id: socket.client.id, score:0};
		console.log(players[socket.client.id]);
		maxplayers++;
		io.emit('servermessage', players[socket.client.id].playernumber+" joined.");
		reportPlayers(socket);
		socket.emit('servercapability', players[socket.client.id], players[socket.client.id].playernumber);
		console.log('dealing...');
		players[socket.client.id].cards = Multiplayer.prototype.deal(7);
		socket.emit('serverdeal', players[socket.client.id].cards);
	}
};

io.on('connection', function(socket){
  socket.on('clientmessage', function() {
	if (players[socket.client.id]) {
		Multiplayer.prototype.clientmessage(socket, arguments);
	} else {
		socket.emit('servermessage', "You need to join before sending messages");
	}
  });
  socket.on('clientmove', function() {
	if (players[socket.client.id]) { // if joined
		console.log(arguments);
		Multiplayer.prototype.clientmove(socket, arguments[0], arguments[1]);
	}
  });
  socket.on('clientshoot', Multiplayer.prototype.clientshoot);
  socket.on('clientslash', Multiplayer.prototype.clientslash);
  socket.on('clientpowerplay', Multiplayer.prototype.clientpowerplay);
  socket.on('clientcounter', Multiplayer.prototype.clientcounter);
  socket.on('clientquit', Multiplayer.prototype.clientquit);
  socket.on('clientturnbegin', Multiplayer.prototype.clientturnbegin);
  socket.on('clientturnend', Multiplayer.prototype.clientturnend);
  socket.on('clientrejoin', function () {
	if (players[socket.client.id]) {
	} else {
		Multiplayer.prototype.clientrejoin(socket, arguments);
	}
  });
  socket.on('clientjoin', function () {
	if (players[socket.client.id]) {
	} else {
		Multiplayer.prototype.clientjoin(socket);
	}
  });
  socket.on('error', function(e){
	console.log(e);
  });
  socket.on('disconnect', function(){
	if (players[socket.client.id]) {
		io.emit('servermessage', players[socket.client.id].playernumber+" quit.");
		oldplayers[socket.client.id] = players[socket.client.id];
		for (var card in players[socket.client.id].cards) {
			delete cardsTaken[card];
			delete players[socket.client.id].cards[card];
		}
		delete players[socket.client.id];
		reportPlayers(socket);
	}
  });
});

var defaultPort = 8088;

http.listen(process.env.PORT || defaultPort);

console.log('express server started on port %s', process.env.PORT || defaultPort);

http.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use, exiting...');
  }
});
