/**
 * This module opens a connection to the database
 * 
 * @author  Andrew Li
 * @version 1.0
 */

 /* Required modules */
var db = require("mongojs").connect("tslDb");

/**
 * Opens the database
 * 
 * @param callback callback function taking (error, db)
 */
function getCollection(collectionName) {
    var collection = db.collection(collectionName);
    return collection;
}

/* Make methods available to other modules */
exports.getCollection = getCollection;
