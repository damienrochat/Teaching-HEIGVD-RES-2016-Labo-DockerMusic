
var protocol = require('./protocol');

var dgram = require('dgram');

var musicians = dgram.createSocket('udp4');

musicians.bind(protocol.PORT,function()
{
	musicians.addMembership(protocol.MULTICAST_ADDRESS);
});

musicians.on('message',function(msg,source)
{
	console.log("Musician : " + msg + " Source : " + source.port);
});