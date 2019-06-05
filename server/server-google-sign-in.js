"use strict";

const app = require("./flash-card-server.js").app;

const passport = require("passport");
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');

const googleSignInData = {
    clientID: '178041928362-o8hcusbdlf9cdmfm3h4pm0s5dsdnut8m.apps.googleusercontent.com',
    clientSecret: 'mu-bG0zseFyZ7AA_7XtU7u-l',
    callbackURL: '/auth/redirect'
};
function gotProfile(accessToken, refreshToken, profile, done) {
	// display profile in command line
	console.log("Google profile", profile);
	
	let firstName = profile._json.given_name;
	let lastName = profile._json.family_name;
	let GoogleID = profile._json.email;
	
	// insert user information into the database
	const addUser = require("./server-database.js").addUser;
	addUser(firstName, lastName, GoogleID);
	 
	done(null, {
		"firstName": firstName,
		"lastName": lastName,
		"GoogleID": GoogleID
	}); 
};
passport.use(new GoogleStrategy(googleSignInData, gotProfile));

app.use(cookieSession({
	keys: ['apple banana cat dog'],
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports.authGoogleProfile = (function () {
	return passport.authenticate('google', {scope: ['profile', "email"]});
})();
module.exports.authGoogle = (function() {
	return passport.authenticate('google');
})();

// check if user has signed in, when trying to access personal data
module.exports.isAuthenticated = function(req, res, next) {
	if (req.user) {
		console.log("Req.session:",req.session);
		console.log("Req.user:",req.user);
		next();
	}
	else {
		res.redirect('/');  // display the sign page
	}
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser(function(user, done) {
    console.log("SerializeUser. Input is", user);
    done(null, user);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser(function(user, done) {
    console.log("deserializeUser. Input is:", user);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    done(null, user);
});


module.exports.redirectToUserPage = function(req, res) {
	console.log('Signed in and using cookies!')
	res.redirect('/user/main.html');
};
