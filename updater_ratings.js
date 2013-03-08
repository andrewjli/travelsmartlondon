/**
 * This module updates the database with new Tube line ratings
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["ratings", "userRatings"]);

function start(response, param) {
    var regex = /\?(Piccadilly|District|Victoria|Circle|Hammersmith_and_City|Bakerloo|Waterloo_and_City|Central|Jubilee|Metropolitan|Northern|DLR|Overground)=([0-5])/;
    var regexForUser = /\?[Ff]or[Uu]ser=([0-9]|[A-Z]|[a-z])*,(Piccadilly|District|Victoria|Circle|Hammersmith_and_City|Bakerloo|Waterloo_and_City|Central|Jubilee|Metropolitan|Northern|DLR|Overground)=([0-5])/;
    if(regexForUser.test(param)) {
        getResult(response, param);
    } else if(regex.test(param)) {
        serve.error(response, 416);
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
    var onComma = onEqualsSign[1].split(",");
    var userName = onComma[0];
    var lineName = onComma[1];
    var rating = parseInt(onEqualsSign[2], 10);
    console.log("username: " + userName);
    console.log("lineName: " + lineName);
    console.log("rating: " + rating);
    //console.log("onComma2: " + onComma[2]);

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

    var onError = function(error) {
        if(error) {
            serve.error(response, 416);
        }
    }
    
    db.userRatings.findOne({"userName" : userName},
                            function(error, result) { 
                                if(error) {
                                    serve.error(response, 416);
                                } else if(!result) {
                                    var json = {
                                        "userName" : userName, 
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
                                    db.userRatings.insert(json, onError);
                                }
                            switch(lineName) { 
                            case "Piccadilly" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Piccadilly" : rating}}, onError);
                                break;
                            case "District" :
                                db.userRatings.update({"userName" : userName}, {$set : {"District" : rating}}, onError);
                                break;
                            case "Victoria" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Victoria" : rating}}, onError);
                                break;
                            case "Circle" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Circle" : rating}}, onError);
                                break;
                            case "Hammersmith_and_City" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Hammersmith_and_City" : rating}}, onError);
                                break;
                            case "Bakerloo" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Bakerloo" : rating}}, onError);
                                break;
                            case "Waterloo_and_City" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Waterloo_and_City" : rating}}, onError);
                                break;
                            case "Jubilee" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Jubilee" : rating}}, onError);
                                break;
                            case "Central" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Central" : rating}}, onError);
                                break;
                            case "Metropolitan" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Metropolitan" : rating}}, onError);
                                break;
                            case "Northern" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Northern" : rating}}, onError);
                                break;
                            case "DLR" :
                                db.userRatings.update({"userName" : userName}, {$set : {"DLR" : rating}}, onError);
                                break;
                            case "Overground" :
                                db.userRatings.update({"userName" : userName}, {$set : {"Overground" : rating}}, onError);
                                break;
                            }                
        });
}

/* Makes start method available to other modules */
exports.start = start;
