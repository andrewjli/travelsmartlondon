/**
 * This module queries the database and retrieves line status data
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["lines"]);

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the database for the given radius
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
    db.line.find(function(error, updates) {
        if(error || !updates) {
            serve.error(response, 416);
        } else {
            var json = [];
            for (var x in updates) {
                json.push(updates[x]);
            }
            serve.jsonobj(response, json);
        }
    });
}

/* Makes start method available to other modules */
exports.start = start;