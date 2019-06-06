"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

const queryBox = document.getElementById("js-query");
const outputBox = document.getElementById("js-output");

// Request translation
function requestTranslation(str) {
	// Sample translation request URL:
	// http://server162.site:port/translate?English=example phrase
	const url = "/translate?English=" + str;
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, displayTranslation);
	
	function displayTranslation() {
		outputBox.value = xhr.responseText;
		// query and output are stored as two internal strings, and are updated only when a request is returned successfully
		if ((!!queryBox.value) && (!!outputBox.value)) { // check if nonempty
			currentFlashCard.English = queryBox.value;
			currentFlashCard.Chinese = outputBox.value;
			console.log(currentFlashCard);
		}
	}
	
};
queryBox.addEventListener("keyup", function (event) {
	if (event.key === "Enter") {
		requestTranslation(queryBox.value);
	}
});

export { requestTranslation };
