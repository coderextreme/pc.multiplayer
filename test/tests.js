QUnit.test( "hello test", function( assert ) {
	assert.async()
	var options = {
            transports: ['websocket'],
            'force new connection': true
        };
 
	var client = io.connect("http://localhost:8080", options);
	assert.ok(client !== null, "Passed!");
 
        client.once("connect", function () {
            client.once("servermessage", function (message) {
		assert.ok( message.substring(2,9) == "joined.", "Passed!" );
 
                client.disconnect();
            });
 
	    client.emit('clientrejoin', location.href);
        });
});
