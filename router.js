/*
 *  This module routes the requests that are received
 *  and calls the appropriate request handler based on
 *  the request URL.
 */

var serve = require("./serve");
var log = require("./log");

function route(handle, response, pathname, param) {
    /*  Check if a defined handle exists for the queried path (e.g. /bus)
        If yes, send handle the request. If not, return 404 */
    if(typeof handle[pathname] === "function") {
        handle[pathname](response, param);
    } else {
        serve.error(response, 404);
    }
}

exports.route = route;