"use strict";

import { makeRequest } from "./main.js";

function getFlashCards() {
	const xhr = new XMLHttpRequest();

	function logFlashCards() {
		let flashCards = JSON.parse(xhr.responseText);
		console.log(flashCards);
	}

	makeRequest(xhr, "/get-flash-cards", logFlashCards);
}

document.body.addEventListener("load", getFlashCards());