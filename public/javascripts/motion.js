	var oldevx = 0;
	var oldevy = 0;
	function move(x, y) {
		socket.emit('clientmove', [x,y,0,0,-1,0]);
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		var radius = 10;
		context.beginPath();
		context.arc(oldevx, oldevy, radius, 0, 2 * Math.PI, false);
		context.fillStyle = "white";
		context.fill();
/*
		context.lineWidth = 4;
		context.strokeStyle = '#FFFFFF';
		context.stroke();
*/

		radius = 9;
		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI, false);
		context.fillStyle = "green";
		context.fill();
/*
		context.lineWidth = 4;
		context.strokeStyle = '#003300';
		context.stroke();
*/
		oldevx = x;
		oldevy = y;
	}
	function eventMove(event) {
		move(event.clientX, event.clientY);
	}
