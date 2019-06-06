"use strict";

const toMainPageButton = document.getElementById("js-to-main-page-button");
toMainPageButton.addEventListener("click", function () {
	// This will be changed in the next assignment; now it is simply a page jump
	window.location.href = "add-flashcards.html";
})