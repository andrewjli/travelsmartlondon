/** 
 * This module fetches Tube Station comments from the databse 
 * 
 * @author Kamil Przekwas, Andrew Li 
 * @version 1.0
*/ 

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["comments"]);

const NO_COMMENTS = "No comments for station";
const COMMENTS_EXIST = "OK"; 

function start(response, param) {

    var regexAll = /\?[Ff]etch[Aa]ll[Ff]or[Ss]tation\=[5-9]\d\d/;
	var regexForUser = /[Ff]etch[Ff]or[Uu]ser\=([A-Z]|[a-z]|[0-9])*\,[Aa]t[Ss]tation\=[5-9]\d\d/;

	var dbFunction = function(error, comments) {
						if(error) {
							serve.error(response, 416);
						} else if(!comments) {
							var json = [{"reply" : NO_COMMENTS}];
							serve.jsonobj(response, json);
						} else {
							var json = [{"reply" : COMMENTS_EXIST}];
							for (var x in comments) {
								json.push(comments[x]);
							}
							serve.jsonobj(response,json);
						}
					};

	if(regexAll.test(param)) {
		var paramNoQestionMark = param.substring(1);

		var stationCode = (paramNoQestionMark.split("="))[1];
		console.log("station code: " + stationCode);

		getAllAt(stationCode);
	} else if(regexForUser.test(param)) {
		var paramNoQestionMark = param.substring(1);
		var paramsEquals = (paramNoQestionMark.split("="))[1];
		var paramsCommaArray = paramsEquals.split(",");

		var userName = paramsCommaArray[0];
		var stationCode = (paramsCommaArray[1].split("="))[1];
        
        console.log("user: " + userName);
        console.log("stationcode: " + stationCode);
        
		getForUserAt(userName, stationCode);
	} else {
		serve.error(response, 416);
	}

	function getAllAt(stationCode) {
		db.comments.find({"stationCode" : stationCode}, dbFunction);
	}

	function getForUserAt(userName, stationCode) {
		db.comments.find({"stationCode" : stationCode, "userName" : userName}, dbFunction);
	}
}

exports.start = start;