"use strict";

const queryBox = document.getElementById("js-query");
let query = queryBox.value;
const outputBox = document.getElementById("js-output");
let output = outputBox.value;


function requestTranslation(str) {
	const url = "translate?english=" + str;
	
	const xhr = new XMLHttpRequest();
	xhr.overrideMimeType("text/plain");
	xhr.open("GET", url);
	
	xhr.onload = function () {
		outputBox.value = xhr.responseText;
		// query and output are stored as two internal strings, and are updated only when a request is returned successfully
		query = queryBox.value;
		output = outputBox.value;
	}
	
	xhr.error = function () {
		console.log(new Error);
	}
	
	xhr.send();
}


queryBox.addEventListener("keyup", function (event) {
	const ENTER_KEY_CODE = 13;
	
	if (event.keyCode === ENTER_KEY_CODE) {
		requestTranslation(queryBox.value);
	}
})