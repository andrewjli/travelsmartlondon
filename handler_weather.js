/**
 * This module queries World Weather Online's API with the
 * co-ordinates and radius, parses the response, manipulates
 * it to remove useless information and then returns the
 * list of bus stops within a radius of the co-ordinates.
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
var dataLoc;

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL downloads the data,
 * otherwise returns an error
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ll]oc\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    
        var weatherurl = { url: "http://free.worldweatheronline.com/feed/weather.ashx?q=" };
        var variables = "format=json&key=04ae09e61f173958132102";
        weatherurl.url = weatherurl.url + param + "&" + variables;
        var rand = Math.floor(Math.random() * 90000);
        dataLoc = "./data/weather" + rand + ".txt";
        
        http.get(weatherurl, dataLoc, function (error, result) {
            if(!error)
                parse(result.file, response);
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
        if(error) { serve.error(response, 500); }
        data = JSON.parse(data.toString());
        var json = manipulateJSON(data);
        serve.jsonobj(response, json);
        
        fs.unlink(dataLoc, function(error) {
            if (error)
                log.error("Failed to delete " + dataLoc);
        });
    });
}

/**
 * Creates a new JSON object and populates it with the useful
 * contents of the given data
 * 
 * @param data a JSON object returned by the parse method
 * @return     a JSON object with all the useless data removed
 */
function manipulateJSON(data) {
    var json = {
        "WeatherDesc": "",
        "IconURL": ""
    };
    json.WeatherDesc = data.data.current_condition[0].weatherDesc[0].value;
    json.IconURL = data.data.current_condition[0].weatherIconUrl[0].value;
    return json;
}

/* Make start method available to other modules */
exports.start = start;