"use strict";

const queryBox = document.getElementById("js-query");
const outputBox = document.getElementById("js-output");


function makeRequest(url) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	
	xhr.onload = function () {
		outputBox.value = xhr.responseText;
	}
	
	xhr.error = function () {
		console.log(new Error);
	}
	
	xhr.send();
}


queryBox.addEventListener("keyup", function (event) {
	const ENTER_KEY_CODE = 13;
	
	if (event.keyCode === ENTER_KEY_CODE) {
		makeRequest("translate?english=" + queryBox.value);
	}
})