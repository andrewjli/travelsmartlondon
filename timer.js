/**
 * This module runs a timer and executes specified
 * modules at the specified intervals
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var lines = require("./updater_lines");

/**
 * Starts the timer
 */
function start() {
    /* Lines refresh every 2 minutes */
    setInterval(lines.start, 120000);
}

/* Make method available to other modules */
exports.start = start;