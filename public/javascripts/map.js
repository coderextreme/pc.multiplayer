// add an OpenStreetMap tile layer
var streets = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var canvasTiles = L.tileLayer.canvas();

canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(0,0,256,256);
}

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map', {
	center: [51.505, -0.09],
	zoom: 13,
	layers: [streets, canvasTiles]
	});

