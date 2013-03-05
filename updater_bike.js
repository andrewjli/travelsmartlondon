/**
 * This module queries TFL's Bike API, parses the response,
 * manipulates it to remove useless information and stores it.
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var log = require("./log");

/**
 * Queries the TFL Bike API URL
 */
function start(db) {
    var tflurl = "http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml";
    http.get(tflurl, function(result) {
        var data = "";
        result.on("data", function(chunk){
            data += chunk;
        });
        
        result.on("end", function(){
            return parse(db, data);
        });
    });
}

/**
 * Reads the downloaded data, turns it into a JSON Object
 * and then returns it
 * 
 * @param data     the downloaded data
 */
function parse(db, data) {
    /* Remove byte-order mark */
    data = data.replace("\ufeff", "");
    
    parser.on("end", function(result) {
        updateDb(db, result);
    });
    
    parser.parseString(data);
}

/**
 * Stores the data into the database
 * 
 * @param data     the parsed downloaded data
 */
function updateDb(db, data) {
    log.info("Bike update - Started");
    data.stations.station.forEach(function(stn) {
        db.bike.update( {
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

/* Make start method available to other modules */
exports.start = start;
