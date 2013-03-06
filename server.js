/**
 * This module creates a server which listens and
 * parses the request URL of any request and sends it
 * to the router.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var url = require("url");
var log = require("./log");
var db = require("./db.js");

/**
 * Starts a server that listens on the specified port and IP address
 * It takes any request it receives and passes it on to the router
 * 
 * @param route  a function provided by the router module
 * @param handle a function provided by the handler module
 */
function start(route, handle) {
    /** 
     * Creates a listener that upon receiving request, parses the
     * URL and saves path and parameters and pass it to the router
     * 
     * @param request  the URL requested by the received request
     * @param response the response object created by the server
     */
    function onRequest(request, response) {
        /* Parse URL */
        var pathname = url.parse(request.url).pathname;
        var param = url.parse(request.url).search;
        log.info("Request for " + pathname + " received");
        
        /* Pass to router */
        request.setEncoding("utf8");
        request.addListener("end", function() {
            route(handle, response, pathname, param);
        });
    }
    
    /* 
     * If you use this on a regular server, comment out line 32.
     * If you use this on Cloud9, comment out line 31.
     * Do not leave both lines uncommented.
     */
    http.createServer(onRequest).listen(4654, "127.0.0.1");
    //http.createServer(onRequest).listen(process.env.PORT, process.env.IP);
    log.info("Server started");
    
    /* Opens database connections and starts timers for parsers that need regular refreshing */
    db.start();
    log.info("Timer started");
}

/* Make method available to other modules */
exports.start = start;
