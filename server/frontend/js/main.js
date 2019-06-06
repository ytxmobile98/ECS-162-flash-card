"use strict";

import { requestTranslation } from "./translate.js";
import { requestToSave } from "./save-to-database.js";

const currentFlashCard = Object.seal({
	"English": "",
	"Chinese": "",
	"isEmpty": function () {
		// returns true if either English or translation is empty
		return ((!this.English) || (!this.Chinese));
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

// Open answer page
const toAnswerPageButton = document.getElementById("js-to-answer-page-button");
toAnswerPageButton.addEventListener("click", function () {
	// This will be changed in the next assignment; now it is simply a page jump
	window.location.href = "answer.html";
});

// Display user name on the bottom bar
const userName = document.getElementById("js-user-name");
userName.addEventListener("load", (function() {
	const xhr = new XMLHttpRequest();
	
	function displayUserInfo() {
		let user = JSON.parse(xhr.responseText);
		userName.textContent = user.firstName;
		userName.title = `${user.firstName} ${user.lastName} (${user.GoogleID})`
	}
	
	makeRequest(xhr, "/get-user-info", displayUserInfo);
	
})());

// Sign out
const signOutButton = document.getElementById("js-sign-out-button");
signOutButton.addEventListener("click", function () {
	window.location.href = "/auth/sign-out";
});



export { currentFlashCard, makeRequest };

