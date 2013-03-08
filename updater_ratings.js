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
    var regexForUser = /\?[Ff]or[Uu]ser=^(,).*,(Piccadilly|District|Victoria|Circle|Hammersmith_and_City|Bakerloo|Waterloo_and_City|Central|Jubilee|Metropolitan|Northern|DLR|Overground)=([0-5])/;
    if(regex.test(param)) {
        getResult(response, param);
    } else if(regexForUser.test(param)) {
        console.log("Success!!!");
    } else {
        serve.error(response, 416);
    }
} 

function getResult(response, param) {
    var dbFunction = function(err, updated) {
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
                    }
    
    var onQuestionMark = param.split("?");
    var onEqualsSign = onQuestionMark[1].split("=");
    var lineName = onEqualsSign[0];
    var rating = parseInt(onEqualsSign[1]);

    switch(rating) {
        case 0 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {0 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        case 1 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {1 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        case 2 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {2 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        case 3 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {3 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        case 4 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {4 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        case 5 : 
            db.ratings.findAndModify({
                query : {line : lineName}, 
                update : {$inc : {5 : 1} }, 
                new : true, 
                upsert : true } , dbFunction ); 
            break;
        default : 
            serve.error(response, 416);
            break;
    }
}

/* Makes start method available to other modules */
exports.start = start;
