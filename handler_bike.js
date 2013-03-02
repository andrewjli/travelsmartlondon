/**
 * This module queries the database and retrieves bike data
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["bike"]);


/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the database for the given radius
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    var dbFunction = function(error, docks) {
        if(error || !docks) {
            serve.error(response, 416);
        } else {
            var json = [];
            for (var x in docks) {
                json.push(docks[x]);
            }
            serve.jsonobj(json);
        }
    }

    var regex = /\?[Ll]oc\=-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+,[0-9][0-9][0-9]+/;
    if(regex.test(param)) {
        var tarray = param.split("=")
        var paramarray = tarray[1].split(",")
        var lat = parseFloat(paramarray[0]);
        var long = parseFloat(paramarray[1]);
        var rad = parseFloat(paramarray[2]);

        var maxLat = lat + (rad/100000);
        var minLat = lat - (rad/100000);
        var maxLong = long + (rad/50000);
        var minLong = long - (rad/50000);

        db.exampleDb.find({$and : [
                            {lat : {$gte : minLat}},
                            {lat : {$lt : maxLat}},
                            {long : {$lt : maxLong}},
                            {long : {$gte : minLong}} 
                            ]} , dbFunction);
    } else {
        serve.error(response, 416);
    }
}

/* Makes start method available to other modules */
exports.start = start;