"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFile = "Flashcards.db";
const db = new sqlite3.Database(dbFile); // this is the actual database object

const createTableCommand = 'CREATE TABLE Flashcards (user INT, english TEXT, chinese TEXT, seen INT, correct INT)';
db.run(createTableCommand, tableCreationCallback);

function tableCreationCallback(err) {
	if (err) {
		console.log("Table creation error",err);
	}
	else {
		console.log("Database created");
		db.close();
  }
}

module.exports.db = db;
