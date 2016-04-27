
/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');


function Musician(instrument)
{
	this.instrument = instrument;
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
			
	}
	
	
	Musician.prototype.update = function()
	{
		var payload = JSON.stringify(this.sound);
					console.log(this.sound);

		var message = new Buffer(payload);
		
		s.send(message,0,message.length,protocol.PORT,protocol.MULTICAST_ADDRESS,function(err,bytes){
			console.log("Sending sound via port " + s.address().port);
		});
	}
	
	//Every 1000 ms
	setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];

var mus = new Musician(instrument);
