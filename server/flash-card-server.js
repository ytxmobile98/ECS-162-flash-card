"use strict";

const express = require("express");
const port = 55776;

const app = express();

// app features: handle different types of requests
// enclosed in an IIFE
const queryHandler = (function () {
	
	// serve the main page
	const root = "./public/";
	const mainPage = "sign-in.html";
	app.use(express.static(root, { index: mainPage }));
	
	// translate
	const translateModule = require("./server-translate.js");
	app.get("/translate", translateModule.translate);
	
	// database
	const databaseModule = require("./server-database.js");
	app.get("/store", databaseModule.store);
	
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
