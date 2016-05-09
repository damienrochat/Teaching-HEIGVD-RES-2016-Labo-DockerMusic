
var protocol = require('./protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');
var uuid = require('uuid');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var socket = dgram.createSocket('udp4');
var instrumentMap = new Map();
instrumentMap.set("flute","trulu");
instrumentMap.set("piano","ti-ta-ti");
instrumentMap.set("trumpet","pouet");
instrumentMap.set("violin","gzi-gzi");
instrumentMap.set("drum","boum-boum");



function Musician(instrument)
{
	this.sound = this.instrumentMap.get(instrument);
	
	Musician.prototype.update = function()
	{
		var dataSend = 
		{
			uuid: uuid.v1(),
			sound: this.sound,
			time:  Date.now()
		};
		var payload = JSON.stringify(dataSend);
		var message = new Buffer(payload);
		
		socket.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending " + payload + " via port " + socket.address().port);
		});
	}
	
	// Every 1000 ms
	setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];

var musician = new Musician(instrument);
