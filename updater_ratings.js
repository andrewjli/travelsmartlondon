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
    var regex = /\?[Uu]ser[Nn]ame=^(,).*,(Piccadilly|District|Victoria|Circle|Hammersmith_and_City|Bakerloo|Waterloo_and_City|Central|Jubilee|Metropolitan|Northern|DLR|Overground)=([0-5])/;
    if(regex.test(param)) {
        getResult(response, param);
    } else {
        serve.error(response, 416);
    }
} 

function getResult(response, param) {
    var tarray = param.split("=");
    var paramArray = tarray[1].split(",");
    var userName = paramArray[0];
    var updateLine = paramArray[1];
    var rating = paramArray[2];
    
    db.ratings.update({$set : { userName :  { ratings : {  updateLine : rating } } } } , function(err, updated) {
        if(err || !updated) {
            serve.error(response, 416);
        } else {
            json = {"response" : "correct"};
            serve.jsonobj(response, json); 
        }
    }); 
}

/* Makes start method available to other modules */
exports.start = start;