/*
 *  This module creates a server which listens and
 *  parses the request URL of any request and sends it
 *  to the router.
 */

var http = require("http");
var url = require("url");
var log = require("./log");
var moment = require("moment");

var timer = require("./timing.js");

function start(route, handle) {
    /*  Upon receiving request, parse URL and save path and parameters
        At the end of the request, send request to router */
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var param = url.parse(request.url).search;
        //var now = moment().utc().format("hh:mm:ss a");
        //console.log("[" + now + "] Request for " + pathname + " received");
        log.info("Request for " + pathname + " received");
        
        request.setEncoding("utf8");
        request.addListener("end", function() {
            route(handle, response, pathname, param);
        });
    }
    
    /*  If you use this on a regular server, comment out line 32.
        If you use this on Cloud9, comment out line 31.
        Do not leave both lines uncommented. */
    //http.createServer(onRequest).listen(80);
    http.createServer(onRequest).listen(process.env.PORT, process.env.IP);
    log.info("Server started");
    
    /*  Start timer for parsers that need to be refreshed
        on a regular basis as opposed to on request*/
    //timer.start();
}

exports.start = start;