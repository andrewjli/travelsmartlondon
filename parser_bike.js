var http = require("http-get");
var xml2js = require("xml2js");
var fs = require("fs");
var MongoClient = require("mongodb").MongoClient;
var log = require("./log");

//additional modules 
var Db = require("mongodb").Db;
var Server = require("mongodb").Server;
var BSON = require("mongodb").BSON;

var parser = new xml2js.Parser();
var output = "./data/bike.json";
var options = { url: "http://www.tfl.gov.uk/tfl/syndication/feeds/cycle-hire/livecyclehireupdates.xml" };
var dataloc = "./data/bike.xml";

function start() {
    log.info("Bike update started");
    http.get(options, dataloc, function (error, result) {
        if (error) {
            log.error(error);
        } else {
            console.log("File downloaded at " + result.file);
            parser.on("end", function(result) {
                //manipulateJSON(result);
                fs.writeFile(output, JSON.stringify(result, null, 4), function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("JSON file successfully saved at: " + output);
                        //connectToDB(JSON);
                        articleProvider(result);
                    }
                });
            });
            
            fs.readFile(result.file, function(error, data) {
                parser.parseString(data);
            });
        }
    });
}

function manipulateJSON(json) {
    for (var i = 0; i < json.stations.station.length; i++) {
        if (json.stations.station[i].installed == "false") {
            json.stations.station.splice(i,1);
            i--;
        } else {
            delete json.stations.station[i].terminalName[0];
            delete json.stations.station[i].installed[0];
            delete json.stations.station[i].installDate[0];
            delete json.stations.station[i].removalDate[0];
            delete json.stations.station[i].temporary[0];
        }
    }
}

function saveToDB(db, JSON) {
    for (var i = 0; i < JSON.stations.station.length; i++) {
        var station = {
            id : JSON.stations.station[i].id[0],
            name: JSON.stations.station[i].name[0],
            lat: parseFloat(JSON.stations.station[i].lat[0]),
            long: parseFloat(JSON.stations.station[i].long[0]),
            locked: JSON.stations.station[i].locked[0],
            nbBikes: JSON.stations.station[i].nbBikes[0],
            nbEmptyDocks: JSON.stations.station[i].nbEmptyDocks[0],
            dbDocks: JSON.stations.station[i].nbDocks[0]
        }; 
        db.insert(station, {w:1}, function(err, result) {
            if (err) {
                    console.log(err);
                } else {
                    console.log("Written BSON object " + i + " to the database");
                }
        });
    }
    console.log("New Bicycle data inserted into the database");
}

function articleProvider(JSON) {
    this.db = new Db("exampleDb", new Server("localhost", 27017, {auto_reconnect: true}, {}));
    this.db.open(function(err,data){
        if(data){ 
            var collection = data.collection("exampleDb");
            collection.remove(function(err, numberOfRemovedDocs) {
                if(err) console.log("The collection COULD NOT be removed: " + err + "\n");
                else console.log("Removed previous data from the database");
            });
            saveToDB(collection, JSON);
            data.close();
        } else{
            console.log(err);
        }
    });
}

function connectToDB(json) {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
        if(err) { return console.dir(err); }
        //db.collection("test", function(err, collection) {});
        //db.collection("test", {w:1}, function(err, collection) {});
        var collection = db.createCollection("test", function(err, collection) {});
        //var collection = db.createCollection("test", {w:1}, function(err, collection) {});
        collection.insert(json, {w:1}, function(err, result) { 
            if (err) {
                console.log(err);
            } else {
                console.log("JSON inserted to the database");
            }
        });
    });
}

exports.start = start;