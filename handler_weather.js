/*
 *  This module queries World Weather Online's API with the co-ordinates and radius,
 *  parses the response, manipulates it to remove useless information
 *  and then returns the list of bus stops within a radius of the co-ordinates.
 */

var http = require("http-get");
var fs = require("fs");
var serve = require("./serve");
var log = require("./log");

var dataloc;

function start(response, param) {
    var regex = /\?[Ll]oc\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    } else {
        serve.error(response, 416);
    }
    
    var weatherurl = { url: "http://free.worldweatheronline.com/feed/weather.ashx?q=" };
    var variables = "format=json&key=04ae09e61f173958132102";
    weatherurl.url = weatherurl.url + param + "&" + variables;
    var rand = Math.floor(Math.random() * 90000);
    dataloc = "./data/weather" + rand + ".txt";
    
    http.get(weatherurl, dataloc, function (error, result) {
        if(error) { serve.error(response, 416); }
        else {
            parse(result.file, response);
        }
    });
}

function parse(file, response) {
    fs.readFile(file, function(error, data) {
        if(error) { serve.error(response, 500); }
        data = JSON.parse(data.toString());
        var json = createJSON(data);
        serve.jsonobj(response, json);
        
        fs.unlink(dataloc, function(error) {
            if (error)
                log.error("Failed to delete " + dataloc);
        });
    });
}

/* Creates a JSON object and populates it with the contents of the JSON Object */
function createJSON(data) {
    var json = {
        "WeatherDesc": "",
        "IconURL": ""
    };
    json.WeatherDesc = data.data.current_condition[0].weatherDesc[0].value;
    json.IconURL = data.data.current_condition[0].weatherIconUrl[0].value;
    return json;
}

exports.start = start;