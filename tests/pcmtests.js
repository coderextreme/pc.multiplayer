var chai = require('chai');
var mocha = require('mocha');
    should = chai.should();

var io = require('socket.io-client');

describe( "join test", function() {
    var server,
	options = {
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function (done) {
	// start the server
	server = require('../app');
	done();
    });
    var client = io.connect("http://localhost:8088", options);
 
 
    it("should rejoin the server and get a join message back", function (done) {
        client.once("connect", function () {
            client.once("servercapability", function (message) {
		console.log(message);
            });
            client.once("servermessage", function (message) {
		message.should.equal("0 joined.");
 
		done();
            });
 
	    client.emit('clientrejoin', "GOOBERS");
        });
    });


    it("should send 2 client move messages and receive a server updates", function (done) {
            client.once("serverupdate", function (player, position, orientation) {
		player.should.equal(0);
		JSON.stringify(position).should.equal(JSON.stringify([0,0,0]));
		JSON.stringify(orientation).should.equal(JSON.stringify([0,0,0]));
                client.once("serverupdate", function (player, position, orientation) {
			player.should.equal(0);
			JSON.stringify(position).should.equal(JSON.stringify([1,0,0]));
			JSON.stringify(orientation).should.equal(JSON.stringify([1,0,0]));
			client.disconnect();
			done();
		});
	        client.emit('clientmove', [1,0,0,1,0,0]);
            });
	    client.emit('clientmove', [0,0,0,0,0,0]);
    });
});
