/**
 * This module updates the database with new Tube line ratings
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["ratings"]);

function start(response, param) {
    var regex = /\?(Piccadilly|District|Victoria|Circle|Hammersmith_and_City|Bakerloo|Waterloo_and_City|Central|Jubilee|Metropolitan|Northern|DLR|Overground)=([0-5])/;
    if(regex.test(param)) {
        getResult(response, param);
    } else {
        serve.error(response, 416);
    }
} 

function getResult(response, param) {
    var tarray = param.split("=");
    var lineName = param[0];
    var rating = parseInt(param[1]);
    
    db.ratings.findAndModify({
            query : {line : lineName}, 
            update : {$inc : {rating : 1} }, 
            new : true, 
            upsert : true } , function(err, updated) {
                                if(err || !updated) {
                                    serve.error(response, 416);
                                } else {
                                    db.ratings.find(function(error, ratings) {
                                        if(error) {
                                            serve.error(response, 416);
                                        } else {
                                            var json = [];
                                            for (var x in ratings) {
                                                json.push(ratings[x]);
                                            }
                                            serve.jsonobj(response, json);
                                        }
                                    })
                                }
            }); 
}

/* Makes start method available to other modules */
exports.start = start;