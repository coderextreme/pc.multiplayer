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
 
 
    it("should rejoin the server and get a join message back", function (done) {
	var client = io.connect("http://localhost:8088", options);
        client.once("connect", function () {
            client.once("servercapability", function (message) {
		console.log(message);
            });
            client.once("servermessage", function (message) {
		message.should.equal("0 joined.");
 
                client.disconnect();
		done();
            });
 
	    client.emit('clientrejoin', "GOOBERS");
        });
    });
});
