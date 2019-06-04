"use strict";

const express = require("express");
const port = 55776;

const app = express();
module.exports.app = app;

// app features: handle different types of requests
// enclosed in an IIFE
const queryHandler = (function () {
	
	// serve the main page
	const root = ".";
	const mainPage = "./public/sign-in.html";
	//app.use(express.static(root, { index: mainPage }));
	
	// translate
	const translateModule = require("./server-translate.js");
	app.get("/translate", translateModule.translate);
	
	// database
	const databaseModule = require("./server-database.js");
	app.get("/store", databaseModule.store);
	
	// login
	const googleLoginModule = require("./server-google-login.js");
	app.get("/*",express.static('public'));
	app.get("/auth/google", googleLoginModule.authGoogleProfile());
	app.get("/auth/redirect", googleLoginModule.authGoogle(), googleLoginModule.redirectToUserPage);
	app.get("/user/*", googleLoginModule.isAuthenticated, express.static('.'));
	
	// LASTLY: if file not found and is not a valid query
	// see: https://expressjs.com/en/4x/api.html#app.use
	function fileNotFound(request, response) {
		const url = request.url;
		response.type('text/plain');
		response.status(404);
		response.send('Cannot find '+ url);
	}
	app.use(fileNotFound);

})();


// start the server and listen for queries
app.listen(port, function () {
	console.log('Listening...');
	console.log(`Server running at http://localhost:${port}/`);
});

