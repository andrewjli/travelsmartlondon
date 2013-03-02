/**
 * This module queries TFL's Tube API with the given parameters,
 * parses the response, manipulates it to remove useless information
 * and then returns it to the client.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http-get");
var xml2js = require("xml2js");
var fs = require("fs");
var parser = new xml2js.Parser();
var serve = require("./serve");
var log = require("./log");

/* Global variables */
var dataloc;

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL downloads the data,
 * otherwise returns an error. Reads the downloaded data,
 * turns it into a JSON Object and sends it to the client
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ss]top\=[BCDHJMNPVW],[A-Z][A-Z][A-Z]/;
    var paramarray = [];
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        paramarray = tarray[1].toString().split(",");

        var tflurl = { url: "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/" };    
        var rand = Math.floor(Math.random() * 90000);
        dataloc = "./data/tube" + rand + ".xml";
        
        tflurl.url = tflurl.url + paramarray[0] + "/" + paramarray[1];
        http.get(tflurl, dataloc, function (error, result) {
            if(!error) {
                parser.on("end", function(result) {
                    //json = createJSON(result);                            /* TO DO */
                    serve.jsonobj(response, result /* json */);
                    
                    /* Delete downloaded data */
                    fs.unlink(dataloc, function(error) {
                        if(error) {
                            log.error("Failed to delete " + dataloc);
                        }
                    });
                });
                
                fs.readFile(result.file, function(error, data) {
                    if(error) {
                        log.error(error);
                    }
                    if(data.toString("hex",0,3) === "efbbbf") {
                        data = data.slice(3); // removes byte order mark
                    }
                    parser.parseString(data);
                });
            }
        });
    } else {
        serve.error(response, 416);
    }
}

/**
 * Creates a new JSON object and populates it with the useful
 * contents of the given data
 * 
 * @param data an array given by the start method
 * @return     a JSON object with all the useless data removed
 */
function createJSON(data) {
    json = {

    }
    return json;
}

/* Make start method available to other modules */
exports.start = start;