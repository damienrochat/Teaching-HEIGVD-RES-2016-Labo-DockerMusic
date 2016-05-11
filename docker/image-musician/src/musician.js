
/**
 * Load required packages
 */
var config = require('./config');
var dgram = require('dgram'); // for udp communication
var uuid = require('uuid'); // for UUID generation

/**
 * Definition of the instruments and their sound
 * Provide a search by instrument name
 */
const INSTRUMENTS = new Map([
    ["flute", "trulu"],
    ["piano", "ti-ta-ti"],
    ["trumpet", "pouet"],
    ["violin", "gzi-gzi"],
    ["drum", "boum-boum"]
]);

/**
 * Create socket
 */
var socket = dgram.createSocket('udp4');

/**
 * Define the Musician object
 * - take a valide instrument name has parameter, otherwise throw an exception
 * - emite the sound of the instrument continuously
 */
function Musician(instrument) {
    if (!INSTRUMENTS.has(instrument)) {
        throw "Unknown instrument";
    }

    // Generate Musician attributs
    this.sound = INSTRUMENTS.get(instrument);
    this.uuid = uuid.v1(); // UUID based on current time
    this.payload = JSON.stringify({
        uuid: this.uuid,
        sound: this.sound
    });

    /**
     * Send function
     * - send the payload with the instrument uuid, time and sound
     */
    Musician.prototype.send = () => {
        var message = new Buffer(this.payload);
        socket.send(message, 0, message.length, config.PROTOCOL_PORT, config.PROTOCOL_MULTICAST_ADDRESS, () => {
            console.log("Sent " + this.payload + " via port " + socket.address().port);
        });
    };
    
    setInterval(this.send.bind(this), config.SEND_INTERVAL);
}

/**
 * Create the instrument based on the user entry
 */
var instrument = process.argv[2];
var musician = new Musician(instrument);
