"use strict";

module.exports.translate = function (request, response) {
	
	const requestQuery = request.query;
	const sourceLang = "english";
	
	if (requestQuery.hasOwnProperty(sourceLang)) {
		
		const APIkey = "AIzaSyDN9t1YWrQ-4LqOjUO3tUWwtx6mzjBUdJk";  // ADD API KEY HERE
		const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
		
		let source = requestQuery[sourceLang];
		const requestObject = {
			"source": "en",
			"target": "zh-cn",
			"q": [source]
		};
		
		const APIrequest = require('request');
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
					console.log("Source: ", source, "; Translated: ", translatedText);
					response.send(translatedText);
				}
			}
		} // end callback function

	}
	else {
		response.send("ERROR: query does not contain property \"english\"");
	}
}
