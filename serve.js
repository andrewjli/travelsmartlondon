/**
 * This module serves the response to any request
 * made to the server. It can serve webpages or JSON
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var fs = require("fs");
var log = require("./log");

/**
 * Serves an error page to the client that the
 * request was received from
 * 
 * @param response the response object created by the server when the request was received
 * @param code     the HTTP error code to be returned to the user
 */
function error(response, code) {
    response.writeHead(code, { "Content-Type": "text/html" });
    if(code === 404) {
        fs.readFile('./html/error404.html', function(error, html) {
            if (error) {
                log.error(error);
            }
            log.error("Bad request - no handler found");
            response.write(html);
            response.end();
        });
    }
    if(code === 416) {
        fs.readFile('./html/error416.html', function(error, html) {
            if (error) {
                log.error(error);
            }
            log.error("Bad request - invalid query");
            response.write(html);
            response.end();
        });
    }
    if(code === 500) {
        fs.readFile('./html/error500.html', function(error, html) {
            if (error) {
                log.error(error);
            }
            log.error("Server error");
            response.write(html);
            response.end();
        });
    }
}

/**
 * Serves an webpage to the client that the
 * request was received from
 * 
 * @param response the response object created by the server when the request was received
 * @param page     the name of the page to be served
 */
function webpage(response, page) {
    response.writeHead(200, { "Content-Type": "text/html" });
    var filename = "./html/" + page + ".html";
    fs.readFile(filename, function(error, html) {
        if (error) {
            log.error(error);
        }
        log.info("Page served");
        response.write(html);
        response.end();
    });
}

/**
 * Serves an JSON object to the client that the
 * request was received from
 * 
 * @param response the response object created by the server when the request was received
 * @param obj     the JSON object to be served
 */
function jsonobj(response, obj) {
    log.info("JSON served");
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj));
    response.end();
}

/* Make methods available to other modules */
exports.error = error;
exports.webpage = webpage;
exports.jsonobj = jsonobj;