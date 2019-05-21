"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

const queryBox = document.getElementById("js-query");
const outputBox = document.getElementById("js-output");

function requestTranslation(str) {
	// Sample translation request URL:
	// http://server162.site:port/translate?english=example phrase
	const url = "translate?english=" + str;
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, displayTranslation);
	
	function displayTranslation() {
		outputBox.value = xhr.responseText;
		// query and output are stored as two internal strings, and are updated only when a request is returned successfully
		if ((!!queryBox.value) && (!!outputBox.value)) { // check if nonempty
			currentFlashCard.english = queryBox.value;
			currentFlashCard.translation = outputBox.value;
			console.log(currentFlashCard);
		}
	}
	
};

queryBox.addEventListener("keyup", function (event) {
	const ENTER_KEY_CODE = 13;
	
	if (event.keyCode === ENTER_KEY_CODE) {
		requestTranslation(queryBox.value);
	}
});

export { requestTranslation };
