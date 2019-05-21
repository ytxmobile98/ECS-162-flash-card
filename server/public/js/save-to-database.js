"use strict";

import { makeRequest, currentFlashCard } from "./main.js";

const saveButton = document.getElementById("js-save");

function requestToSave(english, translation) {
	// Sample storing request URL:
	// http://server162.site:port/store?english=China&chinese=中国
	const url = "store?english=" + english + "&chinese=" + translation;
	
	const xhr = new XMLHttpRequest();
	makeRequest(xhr, url, savingFeedback);
}

saveButton.addEventListener("click", function () {
	
});

export { requestToSave };