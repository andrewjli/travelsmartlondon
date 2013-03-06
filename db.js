/**
 * This module opens a connection to the database
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var log = require("./log");
//var lines = require("./updater_lines");
var bikes = require("./updater_bike");
var bikedb = require("mongojs").connect("tslDb", ["bike"]);
//var linedb = require("mongojs").connect("tslDb", ["line"]);

/**
 * Starts the update timer
 */
function start() {
    bikes.start(bikedb);
    setTimeout(start, 30000);
/*    setInterval(function() {
    	bikes.start(bikedb)
    }, 30000)*/
}

/* Make methods available to other modules */
exports.start = start;
