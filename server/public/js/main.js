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

export { currentFlashCard, makeRequest };

