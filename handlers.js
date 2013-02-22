/*
 *  This module is a master switch for all the different
 *  handlers for each type of request. If a handler exists
 *  for that request, it will call it and execute the handler.
 */

var serve = require("./serve");

var handler_bus = require("./handler_bus");
var handler_stops = require("./handler_stops");
var handler_tube = require("./handler_tube");
var handler_bike = require("./handler_bike");
var handler_lines = require("./handler_lines");
var handler_crowd = require("./handler_crowd");

function index(response, param) {
    serve.webpage(response, "index");
}

function bus(response, param) {
    handler_bus.start(response, param);
}

function stops(response, param) {
    handler_stops.start(response, param);
}

function tube(response, param) {
    handler_tube.start(response, param);
}

function bike(response, param) {
    handler_bike.start(response, param);
}

function lines(response, param) {
    handler_lines.start(response, param);
}

function crowd(response, param) {
    handler_crowd.start(response, param);
}

/*  Define the different handlers. Each handler needs to be manually
    defined in the handle object to make them available. */
var handle = {};
handle["/"] = index;
handle["/index"] = index;
handle["/bus"] = bus;
handle["/stops"] = stops;
handle["/tube"] = tube;
//handle["/bike"] = bike;
//handle["/lines"] = lines;
//handle["/crowd"] = crowd;

exports.handle = handle;