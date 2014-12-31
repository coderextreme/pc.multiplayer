function Player() {
};

var players = [];
var thisplayer = -1;

Player.prototype = {
	servermessage: function(msg) {
		$('#messages').append($('<li>').text(msg));
	},
	serverupdate: function(playernumber, position, orientation) {
		// $('#messages').append($('<li>').text(playernumber+" at "+position+" turns "+orientation));
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		if (typeof players[playernumber] === 'undefined') {
			$('#messages').append($('<li>').text(playernumber+" at "+position+" turns "+orientation));
			players[playernumber] = {
				position: position,
				orientation: orientation
			};
			$('#messages').append($('<li>').text(playernumber+" initialized"));
		}
		for (var player in players) {
			context.font = "10px Verdana";
			context.fillStyle = "white";
			if (typeof players[player].position !== 'undefined') {
				context.fillText("<"+player+">", players[player].position[0], players[player].position[1]);
			}
			// only fill in black for this player
			context.fillStyle = "black";
			if (playernumber == player) {
				context.fillText("<"+player+">", position[0], position[1]);
			} else if (typeof players[player].position !== 'undefined') {
				context.fillText("<"+player+">", players[player].position[0], players[player].position[1]);
			}
		}
		players[playernumber] = {
			position: position,
			orientation: orientation
		}
		// $('#messages').append($('<li>').text(playernumber+" this "+thisplayer));
		if (thisplayer == playernumber) {
			if (position[0] == 0 && position[1] == 0 && position[2] == 0) {
				alert("Beginning again");
			}
			// only move towards mouse if this player is the one who got updated
			if (oldevx != position[0] || oldevy != position[1]) {
				move(oldevx,oldevy)
			}
		}
        },
	serverheal: function() { console.log(arguments);},
	serverdamage: function() { console.log(arguments);},
	servercollision: function() { console.log(arguments);},
	serverorderchange: function() { console.log(arguments);},
	serverdie: function() { console.log(arguments);},
	servererror: function() { console.log(arguments);},
	serverroompurge: function() { console.log(arguments);},
	serverroomready: function() { console.log(arguments);},
	serverpowerplay: function() { console.log(arguments);},
	servercounter: function() { console.log(arguments);},
	serverturnbegin: function() { console.log(arguments);},
	serverturnend: function() { console.log(arguments);},
	serverscore: function(playernumber, score) {
		players[playernumber] = score;
		if (score == 1) {
			$('#score').append($('<li id="'+playernumber+'">').text(playernumber+" has "+score+" points"));
		} else {
			$('#'+playernumber).text(playernumber+" has "+score+" points");
		}
	},
	servercapability: function() {
		if ( history.pushState ) {
			var href = location.href;
			var i = href.indexOf("?");
			if (i >= 0) {
				href = href.substring(0, i);
			}
			history.pushState( {}, document.title, href+"?"+arguments[0].id );
		}
		console.log(arguments);
		thisplayer = arguments[1];
	}
};
      $('form').submit(function(){
        socket.emit('clientmessage', $('#m').val());
        $('#m').val('');
        return false;
      });
  socket.on('servermessage', Player.prototype['servermessage']);
  socket.on('serverupdate', Player.prototype['serverupdate']);
  socket.on('serverheal', Player.prototype['serverheal']);
  socket.on('serverdamage', Player.prototype['serverdamage']);
  socket.on('servercollision', Player.prototype['servercollision']);
  socket.on('serverorderchange', Player.prototype['serverorderchange']);
  socket.on('serverdie', Player.prototype['serverdie']);
  socket.on('servererror', Player.prototype['servererror']);
  socket.on('serverroompurge', Player.prototype['serverroompurge']);
  socket.on('serverroomready', Player.prototype['serverroomready']);
  socket.on('serverscore', Player.prototype['serverscore']);
  socket.on('serverpowerplay', Player.prototype['serverpowerplay']);
  socket.on('servercounter', Player.prototype['servercounter']);
  socket.on('serverturnbegin', Player.prototype['serverturnbegin']);
  socket.on('serverturnend', Player.prototype['serverturnend']);
  socket.on('servercapability', Player.prototype['servercapability']);
  socket.emit('clientrejoin', location.href);
  socket.emit('clientmove', [0,0,0,0,0,0]);
  // socket.emit('clientjoin');
