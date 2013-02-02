/*
 *  This module routes the requests that are received
 *  and calls the appropriate request handler based on
 *  the request URL.
 */

var fs = require("fs");

function route(handle, pathname, response, param) {
    /*  Check if a defined handle exists for the queried path (e.g. /bus)
        If yes, send handle the request. If not, return 404 */
    if (typeof handle[pathname] === "function") {
        handle[pathname](response, param);
    } else {
        fs.readFile('./html/error404.html', function (err, html) {
            if (err) { console.log(err); }
            response.writeHead(404, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        });
    }
}

exports.route = route;