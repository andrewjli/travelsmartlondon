/*
 *  This module queries TFL's bus API with the given parameters,
 *  parses the response, manipulates it to remove useless information
 *  and then returns it to the client.
 */

var http = require("http-get");
var fs = require("fs");
var moment = require("moment");
var serve = require("./serve");
var log = require("./log");

var dataloc;

function start(response, param) {
    var regex = /\?[Ss]top\=[0-9][0-9][0-9][0-9][0-9]/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];
    } else {
        serve.error(response, 416);
    }
    
    var tflurl = { url: "http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1?stopcode1=" };
    var returnlist = "ReturnList=DestinationText,LineName,EstimatedTime";
    tflurl.url = tflurl.url + param + "&" + returnlist;
    var rand = Math.floor(Math.random() * 90000);
    dataloc = "./data/bus" + rand + ".txt";
    
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
            array[i] = temp.toString().split(",");
        }
        
        array = array.sort(compare);
        manipulateArray(array);
        var json = createJSON(array);
        serve.jsonobj(response, json);
        
        fs.unlink(dataloc, function(error) {
            if (error)
                log.error("Failed to delete " + dataloc);
        });
    });
}

/*  Takes the array and manipulates it to get rid of unwanted data and convert
    Epoch time into a time counter from "now" (e.g. 'in 1 minute') */
function manipulateArray(array) {
    for(var i = 0; i < array.length; i++) {
        array[i].shift(); //gets rid of the first item
        array[i][0] = array[i][0].substr(1,array[i][0].length-2); //gets rid of quotation marks for first item
        if (array[i][2] === undefined) {
            array[i][1] = array[i][1].substr(0,13); // gets rid of \r at end
            array[i][1] = moment.utc(parseInt(array[i][1], 10));
        } else {
            array[i][1] = array[i][1].substr(1,array[i][1].length-2); // gets rid of quotation marks for destination
            array[i][2] = array[i][2].substr(0,10); // gets rid of \r at end
            array[i][2] = moment.unix(array[i][2]).fromNow();
            if (array[i][2] === "in a few seconds") // replaces "in a few seconds" with a more suitable phrase
                array[i][2] = "momentarily";
        }
    }
}

/*  Criteria to sort array. Allows sorting of a 2D array based on the Epoch time stamp.
    The lower the number, the higher it appears up in the array when the sort is done. */
function compare(arrayA, arrayB) {
     return (arrayA[3] == arrayB[3] ? 0 : (arrayA[3] < arrayB[3] ? -1 : 1));
}

/* Creates a JSON object and populates it with the contents of the array */
function createJSON(array) {
    var json = {
        "$": {
            "lastUpdate": "",
            "version": ""
        }
    };
    for (var i = 0; i < array.length; i++) {
        if (array[i][2] === undefined) {
            json.$.lastUpdate = array[i][1];
            json.$.version = array[i][0];
        } else {
            var temp = {
                "Route": "",
                "Destination": "",
                "Time": ""
            };
            temp.Route = array[i][0];
            temp.Destination = array[i][1];
            temp.Time = array[i][2];
            json[i] = temp;
        }
    }
    return json;
}

exports.start = start;