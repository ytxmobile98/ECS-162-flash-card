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


export { flashCards, requestFlashCards };