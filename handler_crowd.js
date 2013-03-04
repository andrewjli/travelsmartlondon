/**
 * This module queries the database and retrieves crowdedness data
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["crowd"]);

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the database for the given time
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var regex = /\?[Ss]top\=[5-9][0-9][0-9],([01][0-9]|2[0-3])[0-5][0-9]/;
    if(regex.test(param)) {
        getResult(response, param);
    } else {
        serve.error(response, 416);
    }
}

function getResult(response, param) {
    var tarray = param.split("=");
    var paramarray = tarray[1].split(",");
    var code = parseInt(paramarray[0]);
    var time = paramarray[1];

    db.crowd.find({ nlc : code }, function(error, station) {
        if(error || !station) {
            serve.error(416);
        } else {
            var timeInt = extractTime(time);
            var hour = time.substring(0,2);
            var result = JSON.stringify(station[0][timeInt]);
            if(result !== "undefined") {
                serve.jsonobj(response, result);
            } else { 
                serve.error(response, 500);
            }
        }
    })
}

/**
 * Turns the provided time into the required time interval
 * 
 * @param time the client requested time
 */
function extractTime(time) {
    function pad(n) {
        if(n < 10) {
            return '0'+n;
        } else {
            return n.toString();
        }
    }
    var hours = parseInt(time.substring(0,2),10);
    var minutes = parseInt(time.substring(2));
    var interval = Math.floor(minutes/15)*15
    if(interval != 45) {
        return (pad(hours)+pad(interval)+"-"+pad(hours)+pad(interval+15));
    } else {
        return (pad(hours)+pad(interval)+"-"+pad(hours+1)+"00");
    }
}

/* Make start method available to other modules */
exports.start = start;
