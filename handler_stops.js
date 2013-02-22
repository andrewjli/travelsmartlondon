/*
 *  This module queries TFL's bus API with the co-ordinates and radius,
 *  parses the response, manipulates it to remove useless information
 *  and then returns the list of bus stops within a radius of the co-ordinates.
 */

var http = require("http-get");
var fs = require("fs");
var serve = require("./serve");

var dataloc;

function start(response, param) {
    var regex = /\?[Rr]ad\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+,[0-9][0-9][0-9]+/;
    if(param === undefined || !regex.test(param)) { serve.error(response, 416); }
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    } else {
        serve.error(response, 416);
    }
    
    var tflurl = { url: "http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1?circle=" };
    var returnlist = "StopPointState=0&ReturnList=StopCode1,StopPointName,StopPointIndicator,StopPointType,Latitude,Longitude";
    tflurl.url = tflurl.url + param + "&" + returnlist;
    var rand = Math.floor(Math.random() * 90000);
    dataloc = "./data/busstop" + rand + ".txt";
    
    http.get(tflurl, dataloc, function (error, result) {
        if(error) { serve.error(response, 416); }
        else {
            parse(result.file, response);
        }
    });
}

function parse(file, response) {
    fs.readFile(file, function(error, data) {
        if(error) { serve.error(response, 500); }
        var array = data.toString().split("\n");
        for(var i = 0; i < array.length; i++) {
            var temp = array[i];
            array[i] = [];
            array[i] = temp.toString().split(/,(?!\s)/);
        }
        
        manipulateArray(array);
        var json = createJSON(array);
        serve.jsonobj(response, json);
        
        fs.unlink(dataloc, function(error) {
            if (error)
                console.log("Failed to delete " + dataloc);
        });
    });
}

/*  Takes the array and filters out useless information */
function manipulateArray(array) {
    //filter values based on StopPointType and StopCode1
    for(var j = 0; j < array.length; j++) {
        if(array[j][2] === "null" || array[j][3] === "null") {
            array.splice(j,1);
            j--;
        }
    }
    array.shift(); //removes first row (last updated date)
    for(var i = 0; i < array.length; i++) {
        array[i].shift(); //gets rid of the first item (the 0s)
        array[i][0] = array[i][0].substr(1,array[i][0].length-2); //gets rid of quotation marks for stop name
        array[i][1] = array[i][1].substr(1,array[i][1].length-2); //gets rid of quotation marks for stop code
        array[i][2] = array[i][2].substr(1,array[i][2].length-2); //gets rid of quotation marks for stop type
        if(array[i][3] !== "null") {
            array[i][3] = array[i][3].substr(1,array[i][3].length-2); //gets rid of quotation marks for stop indicator
        } else {
            array[i][3] = "N/A";
        }
        if(i === array.length-1) {
            array[i][5] = array[i][5].substr(0,array[i][5].length-1); // gets rid of ] at end
        } else {
            array[i][5] = array[i][5].substr(0,array[i][5].length-2); // gets rid of ]\r at end
        }
    }
}

/* Creates a JSON object and populates it with the contents of the array */
function createJSON(array) {
    var json = {
        "Stations": []
    };
    for (var i = 0; i < array.length; i++) {
        var temp = {
            "StopName": "",
            "StopCode": "",
            "StopIndicator": "",
            "Long": "",
            "Lat": ""
        };
        temp.StopName = array[i][0];
        temp.StopCode = array[i][1];
        temp.StopIndicator = array[i][3];
        temp.Long = array[i][4];
        temp.Lat = array[i][5];
        json.Stations.push(temp);
    }
    return json;
}

exports.start = start;