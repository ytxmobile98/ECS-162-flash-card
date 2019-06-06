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
	let getFlashCardsCmd = `SELECT DISTINCT Chinese, English, seen, correct from FlashCards where user = "${user}" ORDER BY Chinese;`;
	
	let flashCards = {};
	
	db.all(getFlashCardsCmd, function (err, rows) {
		rows.forEach(function (row) {
			console.log(row);
			
			if (!flashCards[row.Chinese]) {
				flashCards[row.Chinese] = Object.seal({
					"English": [],
					"seen": row.seen,
					"correct": row.correct,
				});
			}
			
			flashCards[row.Chinese].English.push(row.English);
			flashCards[row.Chinese].seen = row.seen;
			flashCards[row.Chinese].correct = row.correct;
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
		console.log(`Updated seen: ${Chinese}`);
	});
	
	// send back the Chinese and seen count to front-end
	let getNewSeenCount = `SELECT DISTINCT Chinese, English, seen from FlashCards where user = "${user}" and Chinese = "${Chinese}" ORDER BY Chinese;`;
	db.get(getNewSeenCount, function (err, row) {
		let result = {
			"Chinese": Chinese,
			"seen": row.seen
		};
		console.log(result);
		res.send(result);
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
		console.log(`Updated correct: ${Chinese}`);
	});
	
	// send back the Chinese and correct count to front-end
	let getNewSeenCount = `SELECT DISTINCT Chinese, English, correct from FlashCards where user = "${user}" and Chinese = "${Chinese}" ORDER BY Chinese;`;
	db.get(getNewSeenCount, function (err, row) {
		let result = {
			"Chinese": Chinese,
			"correct": row.correct
		};
		console.log(result);
		res.send(result);
	});
}

module.exports.updateCorrect = function (req, res) {
	let user = req.user.GoogleID;
	let Chinese = req.query.Chinese;
	updateCorrect(res, user, Chinese);
}

