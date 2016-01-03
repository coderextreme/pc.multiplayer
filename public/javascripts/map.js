// create a map in the "map" div, set the view to a given place and zoom

/*
var canvasTiles = WE.tileLayer.canvas();

canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(0,0,256,256);
};
*/

var options = {sky:true, atmosphere: true, center: [0, 0], zoom: 0};

var map = WE.map('map', options);

/*
WE.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
          subdomains: '1234',
          attribution: 'Tiles Courtesy of MapQuest'
}).addTo(map);

WE.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function eventMove(event) {
	move([event.latlng.lng, event.latlng.lat, 0]);
}
map.on('click', eventMove);
