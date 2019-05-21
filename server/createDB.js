"use strict";

// Globals
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const tableName = "Flashcards";
const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.

module.exports.tableName = tableName;
module.exports.dbFileName = dbFileName;

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = "CREATE TABLE " + tableName + " (user INT, english TEXT, chinese TEXT, seen INT DEFAULT 0, correct INT DEFAULT 0)";
db.run(cmdStr, tableCreationCallback);

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
	if (err) {
		console.log("Table creation error",err);
	}
	else {
		console.log("Database created");
		db.close();
  }
}
