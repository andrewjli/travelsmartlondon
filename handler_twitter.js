/**
 * This module queries Twitter search API 
 * It retrieves twits and returns them formatted to the client
 * 
 * @author  Kamil Przekwas
 * @version 1.0
 */
 
 /* Required modules */
var http = require("http");
var serve = require("./serve");

/**
 * Checks to see if the query matches the specified
 * format. If it does, queries the URL
 * 
 * Uses Twitter API 1.0 which does not require cleint 
 * authorization
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function start(response, param) { 
     var regexStation = /\?[Ff]etch[Ff]or[Ss]tation\=.+/;
     var regexLine = /\?[Ff]etch[Ff]or[Ll]ine\=.+/;
     var twitterUrl = "http://search.twitter.com/search.json?q=";
     var returnList = "&rpp=10&include_entities=false&result_type=mixed&lang=en";
     
     if(regexStation.test(param)) {
         var station = (param.split("="))[1];
         var spaceStationEncoded = "%20station";
         var queryStation = twitterUrl + station + spaceStationEncoded + returnList; 
         queryTwitter(queryStation);
         
     } else if(regexLine.test(param)) {
         var line = (param.split("="))[1];
         var spaceLineEncoded = "%20line";
         var queryLine = twitterUrl + line + spaceLineEncoded + returnList; 
         queryTwitter(queryLine);
         
     } else {
         serve.error(response, 416);
     }
     
    function queryTwitter(url) {
        http.get(url, function(result) {
            var data = "";
            result.on("data", function(chunk){
                data += chunk;
            });
            
            result.on("end", function(){
                parse(data, response);
            });
        });
    }
}

function parse(data, response) {
    var json = [];
    var x;
    for(x in data.results) {
        var obj = { "created_at" : data.results[x].created_at,
                    "from_user" : data.results[x].from_user,
                    "text" : data.results[x].text
        };
        json.push(obj);
    }
    serve.jsonobj(response, json);
}