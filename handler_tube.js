/**
 * This module queries TFL's Tube API with the given parameters,
 * parses the response, manipulates it to remove useless information
 * and then returns it to the client.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var serve = require("./serve");

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

        var tflurl = "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/";
        tflurl = tflurl + paramarray[0] + "/" + paramarray[1];
        
        http.get(tflurl, function(result) {
            var data = "";
            result.on("data", function (chunk){
                data += chunk;
            });
            
            result.on("end", function(){
                parse(data, response);
            });
        });
    } else {
        serve.error(response, 416);
    }
}

function parse(data, response) {
    var newdata = data.replace("\ufeff", "");
    
    parser.on("end", function(result) {
        //json = createJSON(result);                            /* TO DO */
        serve.jsonobj(response, result /* json */);
    });
    
    parser.parseString(newdata);
}

/**
 * Creates a new JSON object and populates it with the useful
 * contents of the given data
 * 
 * @param data an array given by the start method
 * @return     a JSON object with all the useless data removed
 */
function createJSON(data) {
    var json = {

    };
    return json;
}

/* Make start method available to other modules */
exports.start = start;