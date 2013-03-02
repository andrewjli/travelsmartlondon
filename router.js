/**
 * This module routes the requests that are received
 * and calls the appropriate request handler based on
 * the request URL
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var log = require("./log");

/**
 * Checks to see if there is a handler for the
 * received request. If yes, executes handler.
 * If no, serves an error
 * 
 * @param handle   a function provided by the handler module
 * @param response the response object created by the server
 * @param pathname the client requested pathname
 * @param param    the client requested parameters
 */
function route(handle, response, pathname, param) {
    if(typeof handle[pathname] === "function") {
        handle[pathname](response, param);
    } else {
        serve.error(response, 404);
    }
}

/* Make method available to other modules */
exports.route = route;