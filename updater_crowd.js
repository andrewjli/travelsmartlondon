/**
 * This module checks a local static data file, clears the existing
 * database and then stores the data in the database. It does not need
 * to be run regularly (only when the local file gets updated) so it
 * should be manually run once, when the local file is updated
 * 
 * @author  Kamil Przekwas, Andrew Li
 * @version 1.0
 */

/* Required modules */
var fs = require("fs");
var log = require("./log");
//var db = require('./db');
var mongodb = require("mongodb");
//var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
//var db = new mongodb.Db("tslDb", server, {w: 1});
var Server = mongodb.Server;
var Db = mongodb.Db;

/**
 * Reads the local file, clears the database and then adds the new data
 */
function updateData() {
    fs.readFile("./data/crowdedness.json", function(error, data) {
        if (error) {
            log.error(error);
        }
        var json = JSON.parse(data);
      
        var db = new Db("tslDb", new Server("localhost", 27017, { auto_reconnect: true }), {w: 1});
        db.open(function(error, database) {
            if(database) {
                var collection = database.collection("crowd");
                collection.remove(function(error) {
                    if(error) {
                        log.error("Crowdedness update - Existing data could not be cleared: " + error);
                    } else {
                        log.info("Crowdedness update - Existing data cleared");
                    }
                });
                for(var x in json) {
                    collection.insert(json[x], {w:1}, function(error, result) {
                        if (error) {
                            log.error("Crowdedness update - Error storing JSON object " + x + ": " + error);
                        }
                    });
                }
            } else {
                log.error("Crowdedness update - Could not open database: " + error);
            }
        });
    });
}

/* Run the method */
updateData();