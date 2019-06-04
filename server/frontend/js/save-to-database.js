"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

const saveButton = document.getElementById("js-save");

function requestToSave(currentFlashCard) {
	
	if (currentFlashCard.isEmpty()) {
		throw new Error("Empty flashcard");
	}
	
	// Sample storing request URL:
	// http://server162.site:port/store?english=China&chinese=中国
	const url = "store?english=" + currentFlashCard.english
		+ "&chinese=" + currentFlashCard.translation;
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, savingFeedback);
	function savingFeedback() {
		if (xhr.status % 100 !== 2) { // if resource loading failed
			throw new Error("Sorry: saving to database FAILED, error code: " + xhr.status);
		}
		console.log("Saved: ", currentFlashCard);
	}
}

saveButton.addEventListener("click", function () {
	try {
		requestToSave(currentFlashCard);
	}
	catch (error) {
		console.log(error);
	}
});

export { requestToSave };