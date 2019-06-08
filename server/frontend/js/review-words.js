"use strict";

import { makeRequest } from "./main.js";

let flashCards = {};

function doNothing(response) {};

function requestFlashCards(doNextWork = doNothing) {
	const xhr = new XMLHttpRequest();
	function onloadCallback() {
		flashCards = JSON.parse(xhr.responseText);
		console.log(flashCards);
		doNextWork(xhr);
	}
	makeRequest(xhr, "/get-flash-cards", onloadCallback);
}

function getNextCard() {
	function getRandomInt(n) {
		// return a random integer in [0..n-1]
		return Math.floor(Math.random() * n);
	}

	let len = Object.keys(flashCards).length;

	do {
		let i = getRandomInt(len);
		let key = Object.keys(flashCards)[i];
		let details = flashCards[key];
		let score = 0;

		if (details) {
			let seen = details.seen;
			let correct = details.correct;
			score = Math.max(1, 5 - correct) + Math.max(1, 5 - seen) + 5 * (seen === 0 ? 0 : (seen - correct) / seen);
		}

		let j = getRandomInt(16);
		if (j <= score) {
			let card = Object.freeze({
				"Chinese": key,
				"details": details
			});
			console.log(card);
			return card;
		}
	} while (1);
}

export { requestFlashCards, getNextCard };
