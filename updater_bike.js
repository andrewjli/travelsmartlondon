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

/**
 * Queries the TFL Bike API URL
 *
 * @return result the parsed JSON result
 */
function start() {
    var tflurl = "http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml";
    http.get(tflurl, function(result) {
        var data = "";
        result.on("data", function(chunk){
            data += chunk;
        });
        
        result.on("end", function(){
            return parse(data);
        });
    });
}

/**
 * Reads the downloaded data, turns it into a JSON Object
 * and then returns it
 * 
 * @param data     the downloaded data
 * @return result  the parsed JSON result
 */
function parse(data) {
    /* Remove byte-order mark */
    data = data.replace("\ufeff", "");
    
    parser.on("end", function(result) {
        return result;
    });
    
    parser.parseString(data);
}

/* Make start method available to other modules */
exports.start = start;
