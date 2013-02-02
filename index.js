/*
 *  This module starts the program. When running this
 *  file, make sure you run it with superuser permissions.
 */

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

server.start(router.route, requestHandlers.handle);