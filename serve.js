/*
 *  This module serves a web/error page to the client.
 */

var fs = require("fs");
var log = require("./log");

function error(response, code) {
    response.writeHead(code, { "Content-Type": "text/html" });
    if(code === 404) {
        fs.readFile('./html/error404.html', function (error, html) {
            if (error) { log.error(error); }
            response.write(html);
            response.end();
        });
    }
    if(code === 416) {
        fs.readFile('./html/error416.html', function (error, html) {
            if (error) { log.error(error); }
            response.write(html);
            response.end();
        });
    }
    if(code === 500) {
        fs.readFile('./html/error500.html', function (error, html) {
            if (error) { log.error(error); }
            response.write(html);
            response.end();
        });
    }
}

function webpage(response, page) {
    response.writeHead(200, { "Content-Type": "text/html" });
    var filename = "./html/" + page + ".html";
    fs.readFile(filename, function (error, html) {
        if (error) { log.error(error); }
        response.write(html);
        response.end();
    });
}

function jsonobj(response, json) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(json));
    response.end();
}

exports.error = error;
exports.webpage = webpage;
exports.jsonobj = jsonobj;