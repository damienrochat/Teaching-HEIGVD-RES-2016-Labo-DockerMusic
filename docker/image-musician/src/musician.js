
var protocol = require('./protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var socket = dgram.createSocket('udp4');


function Musician(instrument)
{
	switch(instrument)
	{
		case "flute":
			this.sound = "trulu";
			break;
		case "piano":
			this.sound = "ti-ta-ti";
			break;
		case "trumpet":
			this.sound = "pouet";
			break;
		case "violin":
			this.sound = "gzi-gzi";
			break;
		case "drum":
			this.sound = "boum-boum";
			break;
		default:
		    throw "Wrong instrument";
		    break;
	}
	
	Musician.prototype.update = function()
	{
		var payload = JSON.stringify(this.sound);
		var message = new Buffer(payload);
		
		socket.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending " + message + " via port " + socket.address().port);
		});
	}
	
	// Every 1000 ms
	setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];

var musician = new Musician(instrument);
