"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

function doNothing(flashCard) {};

// Request translation

function requestTranslation(str, handleTranslation = doNothing) {

	// Sample translation request URL:
	// http://server162.site:port/translate?English=example phrase
	const url = "/translate?English=" + str;
	
	function displayTranslation() {
		// query and output are stored as two internal strings, and are updated only when a request is returned successfully
		if ((!!str) && (!!xhr.responseText)) { // check if nonempty
			currentFlashCard.English = str;
			currentFlashCard.Chinese = xhr.responseText;
			console.log(currentFlashCard);
			handleTranslation(currentFlashCard);
		}
	}
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, displayTranslation);
	
	
	
};

export { requestTranslation };
