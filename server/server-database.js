"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbCreatorFileName = "./createDB.js";

const dbFileName = require(dbCreatorFileName).dbFileName;
const db = new sqlite3.Database(dbFileName); // this is the actual database object

const tableName = require(dbCreatorFileName).tableName;

function insert(user, english, chinese) {
	let insertCmd = "INSERT INTO " + tableName + "(user, english, chinese) VALUES ";
	let insertValues = "(" + user + ", '" + english + "', '" + chinese + "');";
	insertCmd += insertValues;
	
	db.run(insertCmd,
		function () {
			console.log("INSERTED: ", user, english, chinese);
		}
	);
}

module.exports.store = function (request, response) {
	let user = 0;
	let english = request.query.english;
	let chinese = request.query.chinese;
	
	insert(user, english, chinese);
}