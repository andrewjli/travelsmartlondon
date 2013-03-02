var winston = require('winston');

function getDate() {
    var d = new Date();
    function pad(n) {
            return n<10 ? '0'+n : n;
    }
    return "["+d.getUTCFullYear()+'-'
            +pad(d.getUTCMonth()+1)+'-'
            +pad(d.getUTCDate())+' '
            +pad(d.getUTCHours())+':'
            +pad(d.getUTCMinutes())+':'
            +pad(d.getUTCSeconds())+']';
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ json: false, timestamp: function () { return getDate() }}),
        new winston.transports.File({ filename: './logs/debug.log', json: false, timestamp: function () { return getDate() }}),
    ],
    exceptionHandlers: [
        new winston.transports.Console({ json: false, timestamp: function () { return getDate() }}),
        new winston.transports.File({ filename: './logs/exceptions.log', json: false, timestamp: function () { return getDate() }}),
    ],
    exitOnError: false
});

module.exports = logger;