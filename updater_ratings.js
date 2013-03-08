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
    
    var onError = function(error) {
        if(error) {
            serve.error(response, 416);
        }
    };
    
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
                                    });
                                }
                    };
    
    var updateGeneral = function(rating, lineName) {
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
    };
    
    var onQuestionMark = param.split("?");
    var onEqualsSign = onQuestionMark[1].split("=");
    var onComma = onEqualsSign[1].split(",");
    var userName = onComma[0];
    var lineName = onComma[1];
    var rating = parseInt(onEqualsSign[2], 10);
    
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
                                    };
                                    db.userRatings.insert(json, onError);
                                }
                            switch(lineName) { 
                            case "Piccadilly" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Piccadilly === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Piccadilly" : rating}}, onError);
                                            updateGeneral(rating, "Piccadilly");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "District" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.District === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"District" : rating}}, onError);
                                            updateGeneral(rating, "District");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Victoria" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Victoria === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Victoria" : rating}}, onError);
                                            updateGeneral(rating, "Victoria");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Circle" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Circle === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Circle" : rating}}, onError);
                                            updateGeneral(rating, "Circle");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Hammersmith_and_City" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Hammersmith_and_City === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Hammersmith_and_City" : rating}}, onError);
                                            updateGeneral(rating, "Hammersmith_and_City");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Bakerloo" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Bakerloo === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Bakerloo" : rating}}, onError);
                                            updateGeneral(rating, "Bakerloo");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Waterloo_and_City" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Waterloo_and_City === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Waterloo_and_City" : rating}}, onError);
                                            updateGeneral(rating, "Waterloo_and_City");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Jubilee" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Jubilee === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Jubilee" : rating}}, onError);
                                            updateGeneral(rating, "Jubilee");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Central" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Central === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Central" : rating}}, onError);
                                            updateGeneral(rating, "Central");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Metropolitan" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Metropolitan === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Metropolitan" : rating}}, onError);
                                            updateGeneral(rating, "Metropolitan");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Northern" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Northern === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Northern" : rating}}, onError);
                                            updateGeneral(rating, "Northern");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "DLR" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.DLR === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"DLR" : rating}}, onError);
                                            updateGeneral(rating, "DLR");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            case "Overground" :
                                db.userRatings.findOne({"userName" : userName}, function(error, result) {
                                    if(error) {
                                        serve.error(result, 416);
                                    } else {
                                        if(result.Overground === null) {
                                            db.userRatings.update({"userName" : userName}, {$set : {"Overground" : rating}}, onError);
                                            updateGeneral(rating, "Overground");
                                        } else {
                                            dbFunction(false, true);
                                        }
                                    }
                                });
                                break;
                            }                
        });
}

/* Makes start method available to other modules */
exports.start = start;
