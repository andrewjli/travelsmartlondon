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

/* Opens connections for the database */
var bikedb = require("mongojs").connect("tslDb", ["bike"]);
var linedb = require("mongojs").connect("tslDb", ["lines"]);

/**
 * Starts the update timer
 */
function start() {
    bikes.start(bikedb);
    setInterval(function() {
    	bikes.start(bikedb)
    }, 300000);
    setInterval(function() {
    	lines.start(linedb)
    }, 180000);//3 minutes
}

/* Make methods available to other modules */
exports.start = start;
