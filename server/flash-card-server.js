"use strict";

const express = require("express");
const port = 55776;

const app = express();
module.exports.app = app;

// app features: handle different types of requests
// enclosed in an IIFE
const queryHandler = (function () {
	
	// sign in
	const GoogleSignInModule = require("./server-google-sign-in.js");
	app.use("/", express.static("public", {index: "/sign-in.html"}));
	app.get("/auth/google", GoogleSignInModule.authGoogleProfile);
	app.get("/auth/redirect", GoogleSignInModule.authGoogle, GoogleSignInModule.redirectToUserPage);
	// per-user content is only visible after login
	app.get("/user/*", GoogleSignInModule.isAuthenticated, express.static("."));
	app.get("/user/", GoogleSignInModule.isAuthenticated, express.static(".", {index: "/main.html"}));
	
	// get user info
	app.get("/get-user-info", GoogleSignInModule.sendUserInfo);
	
	// sign out
	app.get('/auth/sign-out', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
	
	// translate
	const translateModule = require("./server-translate.js");
	app.get("/translate", translateModule.translate);
	
	// database
	const databaseModule = require("./server-database.js");
	app.get("/store", databaseModule.store);
	app.get("/find", databaseModule.find);
	app.get("/get-flash-cards", databaseModule.getFlashCards);
	app.get("/update-seen", databaseModule.updateSeen);
	app.get("/update-correct", databaseModule.updateCorrect);

	
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

