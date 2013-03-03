/**
 * This module queries TFL's Line Status API, parses the response,
 * manipulates it to remove useless information and stores it.
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var http = require("http");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var log = require("./log");
var MongoClient = require("mongodb").MongoClient;
var Db = MongoClient.Db;
var Server = MongoClient.Server;

/**
 * Queries the TFL Line Status API URL
 */
function start() {
    log.info("Line update - Started");
    var tflurl = "http://cloud.tfl.gov.uk/TrackerNet/LineStatus";
    
    http.get(tflurl, function(result) {
        var data = "";
        result.on("data", function(chunk){
            data += chunk;
        });
        
        result.on("end", function(){
            parse(data);
        });
    });
}

/**
 * Reads the downloaded data, turns it into a JSON Object
 * and sends it as a response to the client request
 * 
 * @param data     the downloaded data
 */
function parse(data) {
    /* Remove byte-order mark */
    data = data.replace("\ufeff", "");
    
    parser.on("end", function(result) {
        getDb(result);
    });
    
    parser.parseString(data);
}

/**
 * Connects to the database, accesses the lines collection
 * clears the existing data, and inserts the new data
 * 
 * @param data     the downloaded data
 */
function getDb(data) {
    this.db = new Db("tslDb", new Server("localhost", 27017, { auto_reconnect: true }, { }));
    this.db.open(function(error, database){
        if(database) {
            var collection = database.collection("lines");
            collection.remove(function(error) {
                if(error) {
                    log.error("Line update - Existing data could not be cleared: " + error);
                }
                else {
                    log.info("Line update - Existing data cleared");
                }
            });
            saveToDb(collection, data);
            database.close();
        } else {
            log.error("Line update - Could not open database: " + error);
        }
    });
}

/**
 * Creates a new JSON object from each entry in the existing data, populating
 * it with only useful data, then stores it in the database
 * 
 * @param collection the opened database collection
 * @param data       the downloaded data
 */
function saveToDb(collection, data) {
    for (var i = 0; i < data.ArrayOfLineStatus.LineStatus.length; i++) {
        var line = {
            lineID : json.ArrayOfLineStatus.LineStatus[i].Line[0].$.ID,
            lineName : json.ArrayOfLineStatus.LineStatus[i].Line[0].$.Name,
            statusDescription: json.ArrayOfLineStatus.LineStatus[i].Status[0].$.Description,
            statusDetails : json.ArrayOfLineStatus.LineStatus[i].$.StatusDetails
        };

        collection.insert(line, { w: 1 }, function(error, result) {
            if(error) {
                log.error("Line update - Error storing JSON object " + i + ": " + error);
            }
        });
    }
    log.info("Line update - New data successfully stored");
}

/* Make start method available to other modules */
exports.start = start;