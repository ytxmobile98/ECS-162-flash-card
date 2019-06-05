"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFileName = "Flashcards.db";
const db = new sqlite3.Database(dbFileName);

// Insert word to database

function insertWord(user, English, Chinese) {
	const tableName = "Flashcards";
	
	let insertCmd = "INSERT INTO FlashCards (user, English, Chinese) VALUES ";
	let insertValues = "('" + user + "', '" + English + "', '" + Chinese + "');";
	insertCmd += insertValues;
	
	db.run(insertCmd,
		function () {
			console.log("INSERTED WORD: ", user, English, Chinese);
		}
	);
}

module.exports.store = function (req, res) {
	console.log("Current user: ", req.user);
	
	let user = req.user.GoogleID;
	let English = req.query.English;
	let Chinese = req.query.Chinese;
	
	insertWord(user, English, Chinese);
}

function addUser(firstName, lastName, GoogleID) {
	const tableName = "Users";
	
	let insertCmd = "INSERT INTO Users (firstName, lastName, GoogleID) VALUES ";
	let insertValues = "('" + firstName + "', '" + lastName + "', '" + GoogleID + "');";
	insertCmd += insertValues;
	
	db.run(insertCmd,
		function () {
			console.log("ADDED USER: ", firstName, lastName, GoogleID);
		}
	);
	
	return GoogleID;
}

module.exports.addUser = function (firstName, lastName, GoogleID) {
	addUser(firstName, lastName, GoogleID);
	return GoogleID;
}