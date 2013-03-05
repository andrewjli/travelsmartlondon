/**
 * This module opens a connection to the database
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var log = require("./log");
var lines = require("./updater_lines");
var bikes = require("./updater_bike");
var bikedb = require("mongojs").connect("tslDb", ["bike"]);
var linedb = require("mongojs").connect("tslDb", ["line"]);

/**
 * Starts the update timer
 */
function start() {
	bikes.start();
    setInterval(bikes.start, 30000)
}

/**
 * Connects to the database, accesses the bike collection
 * clears the existing data, and inserts the new data
 * 
 * @param data     the downloaded data
 */
function updateBike() {
	log.info("Bike update - Started");
	var data = bikes.start();
    data.stations.station.forEach(function(stn) {
        bikedb.bike.update( {
            id : parseInt(stn.id[0],10)
        }, {
            $set: {
                name: stn.name[0],
                lat: parseFloat(stn.lat[0]),
                long: parseFloat(stn.long[0]),
                locked: stn.locked[0],
                nbBikes: stn.nbBikes[0],
                nbEmptyDocks: stn.nbEmptyDocks[0],
                dbDocks: stn.nbDocks[0]
            }
        }, {
            multi: true
        }, function(error) {
            if(error) {
                log.error("Bike update - Error updating bike dock " + stn.id[0] + ": " + error);
            }
        });
    });
    log.info("Bike update - New data successfully stored");
}

/* Make methods available to other modules */
exports.start = start;
