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
 * format. If it does, queries the URL
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
            result.on("data", function(chunk){
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

/**
 * Reads the downloaded data, turns it into a JSON Object
 * and sends it as a response to the client request
 * 
 * @param data     the downloaded data
 * @param response the response object created by the server when the request was received
 */
function parse(data, response) {
    /* Remove byte-order mark */
    data = data.replace("\ufeff", "");
    
    parser.on("end", function(result) {
        var json = createJSON(result);
        serve.jsonobj(response, json);
    });
    
    parser.parseString(data);
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
        "LineName": "",
        "StationName": "",
        "Platform": []
    };
    json.LineName = data.ROOT.LineName[0];
    json.StationName = data.ROOT.S[0].$.N.substring(0,data.ROOT.S[0].$.N.length-1);
    for(var i = 0; i < data.ROOT.S[0].P.length; i++) {
        var temp = {
            "PlatformName": "",
            "Trains": []
        };
        temp.PlatformName = data.ROOT.S[0].P[i].$.N;
        for(var j = 0; j < data.ROOT.S[0].P[i].T.length; j++) {
            var train = {
                "Destination": "",
                "TimeTo": "",
            };
            if(data.ROOT.S[0].P[i].T[j].$.Destination === "Unknown") {
                train.TimeTo = "See front of train";
            } else {
                train.Destination = data.ROOT.S[0].P[i].T[j].$.Destination;
            }
            if(data.ROOT.S[0].P[i].T[j].$.TimeTo === "-") {
                train.TimeTo = "At Platform";
            } else {
                var tarray = data.ROOT.S[0].P[i].T[j].$.TimeTo.split(":");
                if(tarray[0] === "0") {
                    train.TimeTo = "Due";
                }
                train.TimeTo = tarray[0] + " min";
            }
            temp.Trains.push(train);
        }
        json.Platform.push(temp);
    }
    return json;
}

/* Make start method available to other modules */
exports.start = start;