/**
 * This module starts the program
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var server = require("./server");
var router = require("./router");
var handlers = require("./handlers");

/* Start the server */
server.start(router.route, handlers.handle);