var chai = require('chai');
var mocha = require('mocha');
var should = chai.should();
var assert = chai.assert;

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
		assert.equal(message.playernumber, 0);
		assert.equal(message.id.substring(16,20), "AAAA");
		assert.equal(message.score, 0);
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
		assert.deepEqual(position, [0,0,0], "Position");
		assert.deepEqual(orientation, [0,0,0], "Orientation");
                client.once("serverupdate", function (player, position, orientation) {
			player.should.equal(0);
			assert.deepEqual(position, [1,0,0], "Position");
			assert.deepEqual(orientation, [1,0,0], "Orientation");
			done();
		});
	        client.emit('clientmove', [1,0,0,1,0,0]);
            });
	    client.emit('clientmove', [0,0,0,0,0,0]);
    });
    it("should send message and receive a server message", function (done) {
            client.once("servermessage", function (message) {
		message.should.equal("<0> Hello World");
		client.disconnect();
		done();
            });
	    client.emit('clientmessage', "Hello World");
    });
});
