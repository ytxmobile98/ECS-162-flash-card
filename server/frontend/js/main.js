"use strict";

import { requestTranslation } from "./translate.js";
import { requestToSave } from "./save-to-database.js";

const currentFlashCard = Object.seal({
	"english": "",
	"translation": "",
	"isEmpty": function () {
		// returns true if either English or translation is empty
		return ((!this.english) || (!this.translation));
	}
});

function makeRequest(xhr, url, onloadCallback) {
	xhr.overrideMimeType("text/plain");
	xhr.open("GET", url);
	
	xhr.onload = onloadCallback;
	
	xhr.error = function () {
		console.log(new Error);
	}
	
	xhr.send();
}

const toAnswerPageButton = document.getElementById("js-to-answer-page-button");
toAnswerPageButton.addEventListener("click", function () {
	// This will be changed in the next assignment; now it is simply a page jump
	window.location.href = "answer.html";
});

const signOutButton = document.getElementById("js-sign-out-button");
signOutButton.addEventListener("click", function () {
	window.location.href = "/auth/sign-out";
})

export { currentFlashCard, makeRequest };

