/** 
 * This module fetches Tube line ratings from the database 
 * 
 * @author Kamil Przekwas, Andrew Li 
 * @version 1.0
 */ 
 
 /* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["ratings", "userRatings"]);

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the database for either
 * user ratings or all ratings submitted
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) {
        //updated
    var dbFunctionAll = function(error, result) {
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
        
    var regexAll = /\?fetch[Aa]ll/;
    var regexUser = /\?[Ff]etch[Ff]or[Uu]ser\=.*/;
    if(regexAll.test(param)) {
        db.ratings.find(dbFunctionAll);
    } else if (regexUser.test(param)) {
        var paramArray = param.split("=");
        var user = paramArray[1];
        db.userRatings.findOne({"userName" : user}, function(error, result) {
       	if(!error) {
            if(result) {
                serve.jsonobj(response, result); 
            } else {
                var json = {
                    "userName" : user, 
                    "Piccadilly" : null,
                    "District" : null,
                    "Victoria" : null,
                    "Circle" : null,
                    "Hammersmith_and_City" : null,
                    "Bakerloo" : null,
                    "Waterloo_and_City" : null, 
                    "Central" : null,
                    "Jubilee" : null,
                    "Metropolitan" : null,
                    "Northern" : null, 
                    "DLR" : null,
                    "Overground" : null
                }
		console.log("json is: " + json);
                db.userRatings.insert(json, function(error) {
                    if(error) {
                        serve.error(response, 416);
                    } else {
			serve.jsonobj(response, json);
                    }
                })
                
            }
        } 
    });
    } else {
	serve.error(response, 416);
    }
}

/* Makes start method available to other modules */
exports.start = start;
