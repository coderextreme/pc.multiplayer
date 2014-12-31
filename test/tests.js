//QUnit.module( "express", {
//	setup: function( assert ) {
//		require("../app.js");
//	}
//});
QUnit.test( "join test", function( assert ) {
	var done = assert.async();
	var options = {
            transports: ['websocket'],
            'force new connection': true
        };
 
	var client = io.connect("http://localhost:8088", options);
 
        client.once("connect", function () {
            client.once("servermessage", function (message) {
		assert.ok( message.substring(2,9) === "joined.", "Passed!");
 
                client.disconnect();
		done();
            });
 
	    client.emit('clientrejoin', location.href);
        });
});
