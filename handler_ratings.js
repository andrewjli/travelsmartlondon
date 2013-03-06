/** 
 * This module fetches Tube line ratings from the database 
 * 
 * @author Kamil Przekwas, Andrew Li 
 * @version 1.0
 */ 
 
 /* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["ratings"]);

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the database for the given radius
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
        
    var dbFunction = function(error, result) {
            if(!error) { 
                var json = [];
                for (var x in result) {
                    json.push(result[x]);
                }
                serve.jsonobj(response, json);
            } else {
                serve.error(response, 416);
            }
        };    
        
    var regex = /\?fetch[Aa]ll/;
    if(regex.test(param)) {
        db.ratings.find(dbFunction);
    } else {
        serve.error(response, 416);
    }
}

/* Makes start method available to other modules */
exports.start = start;