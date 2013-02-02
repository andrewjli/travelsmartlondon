/*
 *  This module starts the program. When running this
 *  file, make sure you run it with superuser permissions.
 */

var server = require("./server");
var router = require("./router");
var handler = require("./handlers");

server.start(router.route, handlers.handle);