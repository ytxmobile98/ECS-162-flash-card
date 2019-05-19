"use strict";

const root = "./public/";
const mainPage = "main.html";

const express = require("express");
const port = 55776;

const app = express();

// serve the main page
app.use(express.static(root, { index: mainPage }));

// translate
const translateModule = require("./server-translate.js");
app.get("/translate", translateModule.translate); 

// LASTLY: if file not found and is not a valid query
function fileNotFound(request, response) {
	const url = request.url;
	response.type('text/plain');
	response.status(404);
	response.send('Cannot find '+ url);
}
app.use(fileNotFound);

// start the server and listen for queries
app.listen(port, function () {
	console.log('Listening...');
	console.log(`Server running at http://localhost:${port}/`);
});
