"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFileName = "Flashcards.db";
const db = new sqlite3.Database(dbFileName);


// Add user

function addUser(firstName, lastName, GoogleID) {
	
	let addUserCmd = `INSERT INTO Users (firstName, lastName, GoogleID) VALUES ("${firstName}", "${lastName}", "${GoogleID}");`;
	
	db.run(addUserCmd,
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

// Insert word to database

function insertWord(user, English, Chinese) {
	
	let insertWordCmd = `INSERT INTO FlashCards (user, English, Chinese) VALUES ("${user}", "${English}", "${Chinese}");`;
	
	db.run(insertWordCmd,
		function () {
			console.log("INSERTED WORD: ", user, English, Chinese);
		}
	);
}

module.exports.store = function (req, res) {
	let user = req.user.GoogleID;
	let English = req.query.English;
	let Chinese = req.query.Chinese;
	insertWord(user, English, Chinese);
}


// Find correct English words from database

function findWords(res, user, Chinese) {
	
	let findCmd = `SELECT DISTINCT English from FlashCards where (user = "${user}" and Chinese = "${Chinese}") ORDER BY English;`;
	
	let result = Object.seal({
		"Chinese": Chinese,
		"English": []
	});
	
	db.all(findCmd, function (err, rows) {
		rows.forEach(function(row) {
			result.English.push(row.English);
		});
		
		console.log(result);
		res.send(result);
	});
	
}

module.exports.find = function (req, res) {
	let user = req.user.GoogleID;
	let Chinese = req.query.Chinese;
	findWords(res, user, Chinese);
}

// Get all flash cards for the current user

function getFlashCards(res, user) {
	let getFlashCardsCmd = `SELECT DISTINCT Chinese, English from FlashCards where user = "${user}" ORDER BY Chinese;`;
	
	let flashCards = {};
	
	db.all(getFlashCardsCmd, function (err, rows) {
		rows.forEach(function (row) {
			console.log(row);
			
			if (!flashCards[row.Chinese]) {
				flashCards[row.Chinese] = [];
			}
			
			flashCards[row.Chinese].push(row.English);
		});
		
		console.log(flashCards);
		res.send(flashCards);
	});
}

module.exports.getFlashCards = function (req, res) {
	let user = req.user.GoogleID;
	getFlashCards(res, user);
}

// Update seen count

function updateSeen(res, user, Chinese) {
	let updateSeenCmd = `UPDATE FlashCards SET seen = seen + 1 where user = "${user}" and Chinese = "${Chinese}";`;
	
	db.run(updateSeenCmd, function () {
		res.send(`Updated seen: ${Chinese}`);
	});
}

module.exports.updateSeen = function (req, res) {
	let user = req.user.GoogleID;
	let Chinese = req.query.Chinese;
	updateSeen(res, user, Chinese);
}

// Update correct count

function updateCorrect(res, user, Chinese) {
	let updateCorrectCmd = `UPDATE FlashCards SET correct = correct + 1 where user = "${user}" and Chinese = "${Chinese}";`;
	
	db.run(updateCorrectCmd, function () {
		res.send(`Updated correct: ${Chinese}`);
	});
}

module.exports.updateCorrect = function (req, res) {
	let user = req.user.GoogleID;
	let Chinese = req.query.Chinese;
	updateCorrect(res, user, Chinese);
}

