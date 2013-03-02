/**
 * This module is a master switch for all the different
 * handlers for each type of request. If a handler exists
 * for that request, it will call it and execute the handler.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var serve = require("./serve");
var handler_bus = require("./handler_bus");
var handler_stops = require("./handler_stops");
var handler_tube = require("./handler_tube");
//var handler_bike = require("./handler_bike");
//var handler_lines = require("./handler_lines");
//var handler_crowd = require("./handler_crowd");
var handler_weather = require("./handler_weather");

/**
 * The handler to serve the index page
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function index(response, param) {
    serve.webpage(response, "index");
}

/**
 * The handler to serve bus countdown data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function bus(response, param) {
    handler_bus.start(response, param);
}

/**
 * The handler to serve bus stop data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function stops(response, param) {
	handler_stops.start(response, param);
}

/**
 * The handler to serve tube countdown data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function tube(response, param) {
    handler_tube.start(response, param);
}

/**
 * The handler to serve bike availability data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function bike(response, param) {
    handler_bike.start(response, param);
}

/**
 * The handler to serve line status data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function lines(response, param) {
    handler_lines.start(response, param);
}

/**
 * The handler to serve crowdedness data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function crowd(response, param) {
    handler_crowd.start(response, param);
}

/**
 * The handler to serve weather data
 * 
 * @param response the response object created by the server when the request was received
 * @param param    the client requested parameters
 */
function weather(response, param) {
	handler_weather.start(response, param);
}

/*
 * Make handlers available to be executed. Each handler
 * needs to be manually added to the handle object
 */
var handle = {};
handle["/"] = index;
handle["/index"] = index;
handle["/bus"] = bus;
handle["/stops"] = stops;
handle["/tube"] = tube;
//handle["/bike"] = bike;
//handle["/lines"] = lines;
//handle["/crowd"] = crowd;
handle["/weather"] = weather;

/*
 * Make the handle object available to other modules
 */
exports.handle = handle;