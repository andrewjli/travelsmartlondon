/**
 * This module is creates a logger that can be used
 * to log information, errors and exceptions
 * 
 * @author  Andrew Li
 * @version 1.0
 */

/* Required modules */
var winston = require('winston');

/**
 * Gets the current date and time and returns it
 * in the desired timestamp format
 */
function getDate() {
    var d = new Date();
    function pad(n) {
        if(n < 10) {
            return '0'+n;
        } else {
            return n;
        }
    }
    return "["+d.getUTCFullYear()+'-'
            +pad(d.getUTCMonth()+1)+'-'
            +pad(d.getUTCDate())+' '
            +pad(d.getUTCHours())+':'
            +pad(d.getUTCMinutes())+':'
            +pad(d.getUTCSeconds())+']';
}

/*
 * Create a new custom logger that prints logs
 * to Console and to specified files.
 */
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: false,
            timestamp: function() {
                return getDate()
            }
        }),
        new winston.transports.File({
            filename: './logs/debug.log',
            json: false,
            timestamp: function() {
                return getDate()
            }
        }),
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            json: false,
            timestamp: function() {
                return getDate()
            }
        }),
        new winston.transports.File({
            filename: './logs/exceptions.log',
            json: false,
            timestamp: function() {
                return getDate()
            }
        }),
    ],
    exitOnError: false
});

/* Make logger available to other modules */
module.exports = logger;