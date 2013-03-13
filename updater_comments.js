/** 
 * This module updates comments for Tube Stations in the mondoDB databse
 * 
 * @author Kamil Przekwas, Andrew Li 
 * @version 1.0
*/ 

/* Required modules */
var serve = require("./serve");
var log = require("./log");
var db = require("mongojs").connect("tslDb", ["comments"]);

const INVALID_COMMENT_FORMAT = "Invalid comment format";
const UPDATE_SUCCESSFUL = "OK";

function start(response, param) {

    var regex = /\?[Ff]or[Ss]tation\=[5-9]\d\d\,[Uu]ser\=([A-Z]|[a-z]|[0-9])*\,[Cc]omment\=.*/;
	var commentRegex = /([A-Z]|[a-z]|[0-9]|\s|\.|\"|\'|\?|\!|\;|\-|\:|\+)*/

	if(regex.test(param)) {
		var paramNoQuestionMark = param.substring(1);
		var paramsEqualsArray = paramNoQuestionMark.split("=");
		
		var userName = (paramsEqualsArray[2].split(","))[0];	
		var stationCode = (paramsEqualsArray[1].split(","))[0];
		var comment = paramsEqualsArray[3];

		if(commentRegex.test(comment)) {
			updateDatabseWithComment(userName, stationCode, comment);
		} else {
			var json = [{"reply" : INVALID_COMMENT_FORMAT}];
			serve.jsonobj(response, json);
		}
	} else {
		serve.error(response, 416);
	}

	function updateDatabseWithComment(userName, stationCode, comment) {
		db.comments.insert({"userName" : userName, "stationCode" : stationCode, "comment" : comment}, function(error) {
																									if(error) {
																										serve.error(response, 416);
																									} else {
																										var json = [{"reply" : UPDATE_SUCCESSFUL}];
																										serve.jsonobj(response,json);
																									}
							});
	}

}

exports.start = start;