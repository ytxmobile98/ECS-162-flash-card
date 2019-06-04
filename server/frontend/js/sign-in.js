"use strict";

const signInButton = document.getElementById("js-sign-in-button");
signInButton.addEventListener("click", function () {
	window.location.href = "auth/google";
})