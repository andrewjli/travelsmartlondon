/**
 * This module queries TFL's bus API with the given parameters,
 * parses the response, manipulates it to remove useless information
 * and then returns it to the client.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var moment = require("moment");
var serve = require("./serve");

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL downloads the data,
 * otherwise returns an error
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ss]top\=[0-9][0-9][0-9][0-9][0-9]/;
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        param = tarray[1];

        var tflurl = "http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1?stopcode1=";
        var returnlist = "ReturnList=DestinationText,LineName,EstimatedTime";
        tflurl = tflurl + param + "&" + returnlist;
        //var rand = Math.floor(Math.random() * 90000);
        //dataloc = "./data/bus" + rand + ".txt";
        
        http.get(tflurl, function(result) {
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
 * @param file     the downloaded data file location
 * @param response the response object created by the server when the request was received
 */
function parse(data, response) {
    var array = data.toString().split("\n");
    for(var i = 0; i < array.length; i++) {
        var temp = array[i];
        array[i] = [];
        array[i] = temp.toString().split(",");
    }
    
    array.shift();
    array = array.sort(compare);
    manipulateArray(array);
    var json = createJSON(array);
    serve.jsonobj(response, json);
}

/**
 * Manipulates the array of data and removes useless information and
 * convert Epoch time into a countdown from current time
 * 
 * @param array an array given by the parse method
 */
function manipulateArray(array) {
    for(var i = 0; i < array.length; i++) {
        array[i].shift();                                               /*gets rid of the first item */
        array[i][0] = array[i][0].substr(1,array[i][0].length-2);       //gets rid of quotation marks for first item
        array[i][1] = array[i][1].substr(1,array[i][1].length-2);   // gets rid of quotation marks for destination
        array[i][2] = array[i][2].substr(0,10);                     // gets rid of \r at end
        array[i][2] = moment.unix(array[i][2]).fromNow();
        if(array[i][2] === "in a few seconds") {
            array[i][2] = "due";
        } else if(array[i][2] === "in a minute") {
            array[i][2] = "1 min";
        } else {
            array[i][2] = array[i][2].substr(3,array[i][2].length-7);
        }
    }
}

/**
 * Criteria to sort array. Allows sorting of a 2D array based
 * on the Epoch time stamp. The lower the number, the higher it
 * appears up in the array when the sort is done.
 * 
 * @param arrayA an array (row) in the array of data
 * @param arrayB another array (row) in the array of data
 * @return       an integer to determine position change
 */
function compare(arrayA, arrayB) {
    if(arrayA[3] == arrayB[3]) {
        return 0;
    } else {
        if(arrayA[3] < arrayB[3]) {
            return -1;
        } else {
            return 1;
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
            "Route": "",
            "Destination": "",
            "Time": ""
        };
        temp.Route = data[i][0];
        temp.Destination = data[i][1];
        temp.Time = data[i][2];
        json.push(temp);
    }
    return json;
}

/* Makes start method available to other modules */
exports.start = start;