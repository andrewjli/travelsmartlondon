/**
 * This module queries TFL's bus API with the co-ordinates and radius,
 * parses the response, manipulates it to remove useless information
 * and then returns the list of bus stops within a radius of the co-ordinates.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http-get");
var fs = require("fs");
var serve = require("./serve");
var log = require("./log");

/* Global variables */
var dataloc;

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL downloads the data,
 * otherwise returns an error
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ll]oc\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+,[0-9][0-9][0-9]+/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    
        var tflurl = { url: "http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1?circle=" };
        var returnlist = "StopPointState=0&ReturnList=StopCode1,StopPointName,StopPointIndicator,StopPointType,Latitude,Longitude";
        tflurl.url = tflurl.url + param + "&" + returnlist;
        var rand = Math.floor(Math.random() * 90000);
        dataloc = "./data/busstop" + rand + ".txt";
        
        http.get(tflurl, dataloc, function (error, result) {
            if(!error) {
                parse(result.file, response);
            }
        });
    } else {
        serve.error(response, 416);
    }
}

/**
 * Reads the downloaded data, turns it into a JSON Object
 * and sends it as a response to the client request
 * 
 * @param file     the downloaded data file location
 * @param response the response object created by the server when the request was received
 */
function parse(file, response) {
    fs.readFile(file, function(error, data) {
        if(error) {
            serve.error(response, 500);
        }
        var array = data.toString().split("\n");
        for(var i = 0; i < array.length; i++) {
            var temp = array[i];
            array[i] = [];
            array[i] = temp.toString().split(/,(?!\s)/);
        }
        
        manipulateArray(array);
        var json = createJSON(array);
        serve.jsonobj(response, json);
        
        /* Delete downloaded data */
        fs.unlink(dataloc, function(error) {
            if(error) {
                log.error("Failed to delete " + dataloc);
            }
        });
    });
}

/**
 * Manipulates the array of data and removes useless information
 * 
 * @param array an array given by the parse method
 */
function manipulateArray(array) {
    /* Filter values based on StopPointType and StopCode1 */
    for(var j = 0; j < array.length; j++) {
        if(array[j][2] === "null" || array[j][3] !== ("\"STBC\"" || "\"STBR\"" || "\"STZZ\"" || "\"STBS\"" || "\"STSS\"" || "\"STVA\"")) {
            array.splice(j,1);
            j--;
        }
    }
    array.shift();                                                      /* Removes first row (last updated date) */
    for(var i = 0; i < array.length; i++) {
        array[i].shift();                                               /* gets rid of the first item */
        array[i][0] = array[i][0].substr(1,array[i][0].length-2);       /* gets rid of quotation marks for stop name */
        array[i][1] = array[i][1].substr(1,array[i][1].length-2);       /* gets rid of quotation marks for stop code */
        array[i][2] = array[i][2].substr(1,array[i][2].length-2);       /* gets rid of quotation marks for stop type */
        if(array[i][3] !== "null") {
            array[i][3] = array[i][3].substr(1,array[i][3].length-2);   /* gets rid of quotation marks for stop indicator */
        } else {
            array[i][3] = "N/A";
        }
        if(i === array.length-1 && array[i][5].substr(array[i][5].length-2,array[i][5].length-1) === "\r") {
            array[i][5] = array[i][5].substr(0,array[i][5].length-1);   /* gets rid of ] at end */
        } else {
            array[i][5] = array[i][5].substr(0,array[i][5].length-2);   /* gets rid of ]\r at end */
        }
    }
}

/**
 * Creates a new JSON object and populates it with the
 * contents of the given data
 * 
 * @param data a JSON object returned by the parse method
 * @return     a JSON object with all the useless data removed
 */
function createJSON(data) {
    var json = [];
    for(var i = 0; i < data.length; i++) {
        var temp = {
            "stopName": "",
            "stopCode": "",
            "stopIndicator": "",
            "long": "",
            "lat": ""
        };
        temp.stopName = data[i][0];
        temp.stopCode = data[i][1];
        temp.stopIndicator = data[i][3];
        temp.lat = data[i][4];
        temp.long = data[i][5];
        json.push(temp);
    }
    return json;
}

/* Makes start method available to other modules */
exports.start = start;