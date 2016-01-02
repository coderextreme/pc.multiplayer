function attrNumber(happy, at, value) {
	if (typeof value == 'undefined') {
		return parseInt(happy.attr(at));
	} else {
		return happy.attr(at, value);
	}
}


function angle(happy, ang) {
	return attrNumber(happy, 'data-angle', ang);
}

/*
$(document).ready(function addCards() {
	for (var card = 0; card < 52; card++) {
		addCard(card);
	}
});
*/

function printCard(card) {
	var suits = [ "clubs", "diamonds", "hearts", "spades" ];
	var s = Math.floor(card / 13);
	var p = card % 13 + 1;
	switch (p) {
	case 1:
		p = "Ace";
		break;
	case 11:
		p = "Jack";
		break;
	case 12:
		p = "Queen";
		break;
	case 13:
		p = "King";
		break;
	}
	if (s === 4) {
		return "a draw";
	} else {
		return p + " of " + suits[s];
	}
}

function addCard(card) {
	var suits = [ "c", "d", "h", "s" ];
	var s = Math.floor(card / 13);
	var p = card % 13 + 1;
	var pip = (p < 10 ?  "0"+p : p);
	var happy = $("<img>").appendTo("#cardarea");
	var ang = card*335/52;
	angle(happy, ang);
	happy
		.attr("id", "card"+card)
		.attr("src", "cards/"+pip+suits[s]+".gif")
		.css({"position": "absolute", "z-index": card % 52, "transform": "translate3d(200px,200px,0px) rotateZ("+angle(happy)+"deg) translate3d(0px,100px,0px)"})
	;
	happy.on("click", function(event) {
		console.log(event);
		socket.emit('clientmove', [0,0,0], [this.id, 0, 'Visible']);
		$(this).remove();
	});
}

function addDraw() {
	if (document.getElementById("card52") === null) { // don't add if already there
		var ang = 52*335/52;
		var happy = $("<img>").appendTo("#cardarea");
		angle(happy, ang);
		happy
			.attr("id", "card"+52)
			.attr("src", "cards/back101.gif")
			.css({"position": "absolute", "transform": "translate3d(200px,200px,0px) rotateZ("+angle(happy)+"deg) translate3d(0px,100px,0px)"})
		;
		happy.on("click", function(event) {
			socket.emit('clientmove', [0,0,0], [this.id, 0, 'Visible']);
		});
	}
}

function loop() {
    // swap two cards
    var c1 = Math.floor(Math.random()*52);
    var c2 = Math.floor(Math.random()*52);
    var happysrc = $('img#card'+c1).attr("src");
    $('img#card'+c1).attr("src", $('img#card'+c2).attr("src"));
    $('img#card'+c2).attr("src", happysrc);
}
