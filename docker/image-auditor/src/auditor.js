
/**
 * Load required packages
 */
var config = require('./config');
var dgram = require('dgram'); // for udp communication
var moment = require('moment'); // for dates formatting
var net = require('net');

/**
 * Definition of the instruments and their sound
 * Provide a search by instrument sound
 */
const INSTRUMENTS = new Map([
    ["trulu", "flute"],
    ["ti-ta-ti", "piano"],
    ["pouet", "trumpet"],
    ["gzi-gzi", "violin"],
    ["boum-boum", "drum"]
]);

/**
 * Define the Auditor object
 */
function Auditor() {
    this.musicians = new Map(); // active musicians

    /**
     * Add a musician to the active list
     * - stop if the sound doesn't exists
     * - update the musician if already in list
     * - or add the new musician
     */
    Auditor.prototype.addMusician = (uuid, sound) => {
        if (!INSTRUMENTS.has(sound)) {
            throw "Unknown instrument sound";
        }
        if (this.musicians.has(uuid)) {
            this.musicians.get(uuid).lastActivity = Date.now();
        }
        else {
            this.musicians.set(uuid, {
                instrument: INSTRUMENTS.get(sound),
                activeSince: Date.now(),
                lastActivity: Date.now()
            });
        }
    };

    /**
     * Get all active musicians
     * - Test if each musician is always active and remove it if necessary
     * - The clean could also been done with an interval
     */
    Auditor.prototype.activeMusicians = () => {
        var list = [];
        this.musicians.forEach((attr, uuid) => {
            if (attr.lastActivity + config.MIN_ACTIVE_TIME < Date.now()) {
                this.musicians.delete(uuid);
            }
            else {
                list.push({
                    uuid: uuid,
                    instrument: attr.instrument,
                    activeSince: moment(attr.activeSince).format("YYYY-MM-DDThh:mm:ss.SSS")
                });
            }
        });
        return list;
    };
}
var auditor = new Auditor();

/**
 * Create and init socket (UDP)
 * - listen on the port
 * - add auditor to the multicast group
 * - handle input messages
 */
var socket = dgram.createSocket('udp4');

socket.on('message', (message, source) => {
    console.log("Musician : " + message + " Source : " + source.port);
    var musician = JSON.parse(message);
    auditor.addMusician(musician.uuid, musician.sound);
});

socket.bind(config.PROTOCOL_PORT, () => {
    console.log("Joining multicast group");
    socket.addMembership(config.PROTOCOL_MULTICAST_ADDRESS);
});

/**
 * Create the server (TCP)
 * - half-close the the connection after write
 */
const server = net.createServer((socket) => {
    console.log("Sending active musicians");
    socket.write(JSON.stringify(auditor.activeMusicians()));
    socket.pipe(socket);
    socket.end();
});

server.listen(config.PROTOCOL_PORT);
