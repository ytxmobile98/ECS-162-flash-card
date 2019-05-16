"use strict";

const root = "../";
const mainPage = "main.html";
const sourceLang = "english";

const express = require("express");
const APIrequest = require('request');
const port = 55776;

function queryHandler(req, res, next) {
	const url = req.url;
	const query = req.query;
	
	if (query.hasOwnProperty(sourceLang)) {
		
		const APIkey = "AIzaSyDN9t1YWrQ-4LqOjUO3tUWwtx6mzjBUdJk";  // ADD API KEY HERE
		const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
		
		let source = query[sourceLang];
		const requestObject = {
			"source": "en",
			"target": "zh-cn",
			"q": [source]
		};
		
		APIrequest({ // HTTP header stuff
			url: url,
			method: "POST",
			headers: {"content-type": "application/json"},
			json: requestObject // will turn the given object into JSON
		}, APIcallback); // callback function for API request
		
		
		// callback function, called when data is received from API
		function APIcallback(err, APIresHead, APIresBody) {
			const errorStr = "Got API error";
			
			// gets three objects as input
			if ((err) || (APIresHead.statusCode != 200)) {
				console.log(errorStr);
				console.log(APIresBody);
			}
			else {
				if (APIresHead.error) {
					// API worked but is not giving you data
					console.log(APIresHead.error);
				}
				else {
					let translatedText = APIresBody.data.translations[0].translatedText;
					console.log("Translated: ", translatedText);
					res.send(translatedText);
				}
			}
		} // end callback function

	}
	else {
		res.send("ERROR: query does not contain property \"english\"");
	}
}

function fileNotFound(req, res) {
	const url = req.url;
	res.type('text/plain');
	res.status(404);
	res.send('Cannot find '+ url);
}

const app = express();

// check if there is a static file
app.use(express.static(root, {
	index: mainPage,
}));

// if static file is not found, check if it is a valid query
app.get("/translate", queryHandler);

// otherwise, not found
app.use(fileNotFound);

// start the server and listen for queries
app.listen(port, function () {
	console.log('Listening...');
	console.log(`Server running at http://localhost:${port}/`);
});