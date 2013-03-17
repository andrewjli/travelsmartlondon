/**
 * This module queries TFL's Line Status API, parses the response,
 * manipulates it to remove useless information and stores it.
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var xml2js = require("xml2js");
var log = require("./log");

/**
 * Queries the TFL Line Status API URL
 * 
 * @param db the database
 */
function start(db) {
    var tflurl = "http://cloud.tfl.gov.uk/TrackerNet/LineStatus";
    http.get(tflurl, function(result) {
        var data = "";
        result.on("data", function(chunk){
            data += chunk;
        });
        
        result.on("end", function(){
            parse(db, data);
        });
    });
}

/**
 * Reads the downloaded data, turns it into a JSON Object
 * 
 * @param db   the database
 * @param data the downloaded data
 */
function parse(db, data) {
    var parser = new xml2js.Parser();
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
 * @param db   the database
 * @param data the parsed downloaded data
 */
function updateDb(db, data) {
    log.info("Line update - Started");
    data.ArrayOfLineStatus.LineStatus.forEach(function(lines) {
        db.line.update( {
            lineID : parseInt(lines.Line[0].$.ID,10)
        }, {
            $set: {
                //lineID : parseInt(lines.Line[0].$.ID),
                //lineName : lines.Line[0].$.Name,
                statusDescription: lines.Status[0].$.Description,
                statusDetails : lines.$.StatusDetails
            }
        }, {
            multi: true
        }, function(error) {
            if(error) {
                log.error("Line update - Error updating line " + lines.id[0] + ": " + error);
            }
        });
    });
    log.info("Line update - New data successfully stored");
}

/* Make start method available to other modules */
exports.start = start;
