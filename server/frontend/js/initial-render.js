"use strict";

import { makeRequest } from "./main.js";

document.addEventListener("load", function () {
	var xhr = new XMLHttpRequest();

	function logFlashCards() {
		var flashCards = JSON.parse(xhr.responseText);
		console.log(flashCards);
	}

	makeRequest(xhr, "/get-flash-cards", logFlashCards);
});