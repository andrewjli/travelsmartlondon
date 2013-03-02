/*
 *  This module queries TFL's Tube API with the given parameters,
 *  parses the response, manipulates it to remove useless information
 *  and then returns it to the client.
 */

var http = require("http-get");
var xml2js = require("xml2js");
var fs = require("fs");
var parser = new xml2js.Parser();
var serve = require("./serve");
var log = require("./log");

var dataloc;

function start(response, param) {
    var regex = /\?[Ss]top\=[BCDHJMNPVW],[A-Z][A-Z][A-Z]/;
    var paramarray = [];
    if(regex.test(param)) {
        var tarray = param.toString().split("=");
        paramarray = tarray[1].toString().split(",");

        var tflurl = { url: "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/" };    
        var rand = Math.floor(Math.random() * 90000);
        dataloc = "./data/tube" + rand + ".xml";
        
        tflurl.url = tflurl.url + paramarray[0] + "/" + paramarray[1];
        http.get(tflurl, dataloc, function (error, result) {
            if (!error) {
                parser.on("end", function(result) {
                    //TODO: maniplate json
                    serve.jsonobj(response, result);
                    
                    fs.unlink(dataloc, function(error) {
                        if (error) {
                            log.error("Failed to delete " + dataloc);
                        }
                    });
                });
                
                fs.readFile(result.file, function(error, data) {
                    if (error) {
                        log.error(error);
                    }
                    if (data.toString("hex",0,3) === "efbbbf") {
                        data = data.slice(3); // removes byte order mark
                    }
                    parser.parseString(data);
                });
            }
        });
    } else {
        serve.error(response, 416);
    }
}

exports.start = start;