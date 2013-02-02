/*
 *  This module is a master switch for all the different
 *  handlers for each type of request. If a handler exists
 *  for that request, it will call it and execute the handler.
 */

var bus = require("./parser_bus");
var tube = require("./parser_tube");
var bike = require("./responder_bike");
var lines = require("./responder_lines");
var crowd = require("./responder_crowd");

function bus(response, param) {
    bus.start(response, param);
}

function tube(response, param) {
    tube.start(response, param);
}

function bike(response, param) {
    bike.start(response, param);
}

function lines(response, param) {
    lines.start(response, param);
}

function crowd(response, param) {
    crowd.start(response, param);
}

/*  Define the different handlers. Each handler needs to be manually
    defined in the handle object to make them available. */
var handle = {};
handle["/bus"] = bus;
//handle["/tube"] = tube;
//handle["/bike"] = bike;
//handle["/lines"] = lines;
//handle["/crowd"] = crowd;

exports.handle = handle;