/**
 * This module queries TFL's Bike API, parses the response,
 * manipulates it to remove useless information and stores it.
 * 
 * @author  Kamil Prezkwas, Andrew Li
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
 * Queries the TFL Bike API URL
 */
function start() {
    log.info("Bike update - Started");
    var tflurl = "http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml";
    
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
 * Connects to the database, accesses the bike collection
 * clears the existing data, and inserts the new data
 * 
 * @param data     the downloaded data
 */
function getDb(data) {
    Db = new Db("tslDb", new Server("localhost", 27017, {auto_reconnect: true}, {}));
    Db.open(function(error, database){
        if(database) {
            var collection = database.collection("bike");
            collection.remove(function(error) {
                if(error) {
                    log.error("Bike update - Existing data could not be cleared: " + error);
                }
                else {
                    log.info("Bike update - Existing data cleared");
                }
            });
            saveToDb(collection, data);
            database.close();
        } else {
            log.error("Bike update - Could not open database: " + error);
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
    for (var i = 0; i < data.stations.station.length; i++) {
        var station = {
            id : data.stations.station[i].id[0],
            name: data.stations.station[i].name[0],
            lat: parseFloat(data.stations.station[i].lat[0]),
            long: parseFloat(data.stations.station[i].long[0]),
            locked: data.stations.station[i].locked[0],
            nbBikes: data.stations.station[i].nbBikes[0],
            nbEmptyDocks: data.stations.station[i].nbEmptyDocks[0],
            dbDocks: data.stations.station[i].nbDocks[0]
        };

        collection.insert(station, { w: 1 }, function(error, result) {
            if(error) {
                log.error("Bike update - Error storing JSON object " + i + ": " + error);
            }
        });
    }
    log.info("Bike update - New data successfully stored");
}

/* Make start method available to other modules */
exports.start = start;