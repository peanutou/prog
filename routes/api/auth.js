/// <reference path="../../typings/tsd.d.ts"/>

// Load require packages
var passport = require('passport');
var BasicStrategy = require ('passport-http').BasicStrategy;
var User = require('mongoose').model('User');

passport.use(new BasicStrategy(
	function(username, password, callback) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return callback(err); }
			
			// No user found with that username
			if (!user) { return callback (null, false); }
			
			// Make sure the password is correct
			user.verifyPassword(password, function (err, isMatch) {
				if (err) { return callback(null, false); }
				
				// Password dit not match
				if (!isMatch) { return callback(null, false); }
				
				// Success
				return callback(null, true);
			});
		});
	}
));

module.exports.isAuthenticated = passport.authenticate('basic', { session: false });