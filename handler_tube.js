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

var dataloc;

function start(response, param) {
    var LineFirst = /\?[Ll]ine\=[BCDHJMNPVW]\&[Ss]top\=[A-Z][A-Z][A-Z]/;
    var StationFirst = /\?[Ss]top\=[A-Z][A-Z][A-Z]\&[Ll]ine\=[BCDHJMNPVW]/;
    var paramarray = [];
    if(param === undefined) { serve.error(response, 416); }
    if(LineFirst.test(param)) {
        var tarray = param.toString().split("&");
        tarray[0] = tarray[0].toString().split("=");
        paramarray[0] = tarray[0][1];
        tarray[1] = tarray[1].toString().split("=");
        paramarray[1] = tarray[1][1];
    } else if(StationFirst.test(param)) {
        var tarray = param.toString().split("&");
        tarray[0] = tarray[0].toString().split("=");
        paramarray[1] = tarray[0][1];
        tarray[1] = tarray[1].toString().split("=");
        paramarray[0] = tarray[1][1];
    } else {
        serve.error(response, 416);
    }
    var tflurl = { url: "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/" };    
    var rand = Math.floor(Math.random() * 90000);
    dataloc = "./data/tube" + rand + ".xml";
    
    tflurl.url = tflurl.url + paramarray[0] + "/" + paramarray[1];
    http.get(tflurl, dataloc, function (error, result) {
        if (error) {
            serve.error(response, 416);
        } else {
            parser.on('end', function(result) {
                //TODO: maniplate json
                serve.jsonobj(response, result);
                
                fs.unlink(dataloc, function(error) {
                    if (error) {
                        console.log("Failed to delete " + dataloc);
                    }
                });
            });
            
            fs.readFile(result.file, function(error, data) {
                if (error) {
                    console.log(error);
                }
                if (data.toString('hex',0,3) === "efbbbf") {
                    data = data.slice(3); // removes byte order mark
                }
                parser.parseString(data);
            });
        }
    });
}

exports.start = start;