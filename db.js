/**
 * This module queries TFL's Line Status API, parses the response,
 * manipulates it to remove useless information and stores it.
 * 
 * @author  Andrew Li
 * @version 1.0
 */

 /* Required modules */
var mongodb = require("mongodb");
var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
var db = new mongodb.Db("tslDb", server, {w: 1});;

/**
 * Opens the database
 * 
 * @param callback callback function taking (error, db)
 */
function openDatabase(callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	    return callback(null, db);
	});
}

/**
 * Connects to the database
 * 
 * @param callback callback function taking (error, collection)
 */
function connect(db, coll, callback) {
	var collection = mongodb.Collection(coll);

	return callback(null, collection);
}

/* Make methods available to other modules */
exports.openDatabase = openDatabase;
exports.connect = connect;