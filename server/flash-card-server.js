"use strict";

const root = "./public/";
const mainPage = "main.html";

const express = require("express");
const APIrequest = require('request');
const port = 55776;

function translate(request, response) {
	const url = request.url;
	const query = request.query;
	const sourceLang = "english";
	
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
					response.send(translatedText);
				}
			}
		} // end callback function

	}
	else {
		response.send("ERROR: query does not contain property \"english\"");
	}
}

function fileNotFound(request, response) {
	const url = request.url;
	response.type('text/plain');
	response.status(404);
	response.send('Cannot find '+ url);
}

const app = express();

app.use(express.static(root, {
	index: mainPage,
}));


app.get("/translate", translate); // translate

app.use(fileNotFound);

// start the server and listen for queries
app.listen(port, function () {
	console.log('Listening...');
	console.log(`Server running at http://localhost:${port}/`);
});