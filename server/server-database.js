"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFileName = "Flashcards.db";
const db = new sqlite3.Database(dbFileName);

const tableName = "Flashcards";

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