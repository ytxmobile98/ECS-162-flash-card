"use strict";

const app = require("./flash-card-server.js").app;

const passport = require("passport");
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');

const googleLoginData = {
    clientID: '178041928362-o8hcusbdlf9cdmfm3h4pm0s5dsdnut8m.apps.googleusercontent.com',
    clientSecret: 'mu-bG0zseFyZ7AA_7XtU7u-l',
    callbackURL: '/auth/redirect'
};
function gotProfile(accessToken, refreshToken, profile, done) {
	console.log("Google profile",profile);
	let dbRowID = 1;
	done(null, dbRowID); 
};
passport.use(new GoogleStrategy(googleLoginData, gotProfile));

app.use(cookieSession({
	keys: ['apple banana cat dog'],
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports.authGoogleProfile = (function () {
	return passport.authenticate('google', {scope: ['profile']});
})();
module.exports.authGoogle = (function() {
	return passport.authenticate('google');
})();

// check if user has logged in, when trying to access personal data
module.exports.isAuthenticated = function(req, res, next) {
	if (req.user) {
		console.log("Req.session:",req.session);
		console.log("Req.user:",req.user);
		next();
	}
	else {
		res.redirect('/sign-in.html');  // display the login page
	}
}

passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: "data from db row goes here"};
    done(null, userData);
});


module.exports.redirectToUserPage = function(req, res) {
	console.log('Logged in and using cookies!')
	res.redirect('/user/main.html');
};
