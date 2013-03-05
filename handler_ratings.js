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
    var dbFunction = function(error, user) {
        if(error) {
            serve.error(response, 416);
        } else if(!user) {
            db.ratings.insert({
                user : {
                    "ratings" : {
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
                    },
                    "comments" : {}
                }
            }, function(err) {
                if(error) {
                    serve.error(response, 416);
                }
            });
        } else {
            var json = {"ratings" : {
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
                }};
            if(user.ratings.Piccadilly !== null) {
                json.ratings.Piccadilly = user.ratings.Piccadilly
            }
            if(user.ratings.District !== null) {
                json.ratings.District = user.ratings.District
            } 
            if(user.ratings.Victoria !== null) {
                json.ratings.Victoria = user.ratings.Victoria
            } 
            if(user.ratings.Circle !== null) {
                json.ratings.Circle = user.ratings.Circle
            } 
            if(user.ratings.Hammersmith_and_City !== null) {
                json.ratings.Hammersmith_and_City = user.ratings.Hammersmith_and_City
            } 
            if(user.ratings.Waterloo_and_City !== null) {
                json.ratings.Waterloo_and_City = user.ratings.Waterloo_and_City
            } 
            if(user.ratings.Central !== null) {
                json.ratings.Central = user.ratings.Central
            } 
            if(user.ratings.Metropolitan !== null) {
                json.ratings.Metropolitan = user.ratings.Metropolitan
            } 
            if(user.ratings.Northern !== null) {
                json.ratings.Northern = user.ratings.Northern
            } 
            if(user.ratings.DLR !== null) {
                json.ratings.DLR = user.ratings.DLR
            } 
            if(user.ratings.Overground !== null) {
                json.ratings.Overground = user.ratings.Overground
            } 
            
            serve.jsonobj(response, json);
        }
    }

    var regex = /\?[Uu]ser[Nn]ame=.*/;
    if(regex.test(param)) {
        var tarray = param.split("=")
        var userName = tarray[1];
        db.ratings.find(userName, dbFunction);
    } else {
        serve.error(response, 416);
    }
}

/* Makes start method available to other modules */
exports.start = start;