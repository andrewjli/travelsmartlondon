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
var http = require("http");
var serve = require("./serve");

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ll]oc\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    
        var weatherurl = "http://free.worldweatheronline.com/feed/weather.ashx?q="
        var variables = "format=json&key=04ae09e61f173958132102";
        weatherurl = weatherurl + param + "&" + variables;

        http.get(weatherurl, function(result) {
            var data = "";
            result.on('data', function (chunk){
                data += chunk;
            });
            
            result.on('end', function(){
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
    data = JSON.parse(data.toString());
    var json = createJSON(data);
    serve.jsonobj(response, json);
}

/**
 * Creates a new JSON object and populates it with the useful
 * contents of the given data
 * 
 * @param data a JSON object given by the parse method
 * @return     a JSON object with all the useless data removed
 */
function createJSON(data) {
    var json = {
        "Temperature": "",
        "WeatherDesc": "",
        "IconURL": ""
    };
    json.Temperature = data.data.current_condition[0].temp_C;
    json.WeatherDesc = data.data.current_condition[0].weatherDesc[0].value;
    json.IconURL = data.data.current_condition[0].weatherIconUrl[0].value;
    return json;
}

/* Make start method available to other modules */
exports.start = start;