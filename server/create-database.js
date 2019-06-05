"use strict";

// Globals
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);

let tableName = "Users";
db.run("CREATE TABLE " + tableName + " (firstName TEXT, lastName TEXT, GoogleID TEXT UNIQUE)", tableCreationCallback(tableName));
tableName = "FlashCards";
db.run("CREATE TABLE " + tableName + " (user TEXT, English TEXT, Chinese TEXT, seen INT DEFAULT 0, correct INT DEFAULT 0)", tableCreationCallback(tableName));

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(tableName) {
	return function (err) {
		if (err) {
			console.log("Table creation error!", err);
		}
		else {
			console.log("Table " + tableName + " created.");
	  }
	}
}

db.close();
