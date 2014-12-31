QUnit.test( "join test", function( assert ) {
	var done = assert.async();
	var options = {
            transports: ['websocket'],
            'force new connection': true
        };
 
	var client = io.connect("http://localhost:8080", options);
 
        client.once("connect", function () {
            client.once("servermessage", function (message) {
		assert.ok( message.substring(2,9) === "joined.", "Passed!");
 
                client.disconnect();
		done();
            });
 
	    client.emit('clientrejoin', location.href);
        });
});
