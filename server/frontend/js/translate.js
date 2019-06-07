"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

// Request translation
function requestTranslation(str, inputField, outputField) {

	// Sample translation request URL:
	// http://server162.site:port/translate?English=example phrase
	const url = "/translate?English=" + str;
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, displayTranslation);
	
	function displayTranslation() {
		outputField.value = xhr.responseText;
		// query and output are stored as two internal strings, and are updated only when a request is returned successfully
		if ((!!inputField.value) && (!!outputField.value)) { // check if nonempty
			currentFlashCard.English = inputField.value;
			currentFlashCard.Chinese = outputField.value;
			console.log(currentFlashCard);
		}
	}
	
};

export { requestTranslation };
