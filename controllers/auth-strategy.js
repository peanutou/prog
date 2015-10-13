/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports;

// Load require packages
var passport = require('passport'),
	BasicStrategy = require('passport-http').BasicStrategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
	DigestStrategy = require('passport-http').DigestStrategy,
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User'),
	Client = require('mongoose').model('Client'),
	Token = require('mongoose').model('Token');

passport.use('basic', new BasicStrategy(
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
				
				// Success, have to return user, passport can store is in req
				return callback(null, user);
			});
		});
	}
));

passport.use('client-basic', new BasicStrategy(
	function (username, password, callback) {
		Client.findOne({ id: username }, function (err, client) {
			if (err) { return callback(err); }

			// No client found with that id or bad password
			if (!client || client.secret !== password) { return callback(null, false); }

			// Success
			return callback(null, client);
		});
	}
));

passport.use('bearer', new BearerStrategy(
	function(accessToken, callback) {
		Token.findOne({ value: accessToken }, function (err, token) {
			if (err) { return callback(err); }
			
			// No token found
			if (!token) { return callback(null, false); }
			
			User.findOne({ _id: token.userId }, function (err, user) {
				if (err) { return callback(err); }
				
				// No user found
				if (!user) { return callback(null, false); }
				
				// Simple example with no scope
				callback(null, user, { scope: '*' });
			})		
		});
	}
));

passport.use('digest', new DigestStrategy(
	{ qop: 'auth' },
	function (username, callback) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return callback(err); }
			
			// No user found with that username
			if (!user) { return callback (null, false); }
			
			// Success
			return callback(null, user, user.password);
		});
	},
	function (params, callback) {
		// validate nonces as necessary
		callback(null, true);
	}
));

passport.use('local', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
  	},
	function (username, password, callback) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return callback(err); }
			
			// No user found with that username
			if (!user) { return callback(null, false); }
			
			// Make sure the password is correct
			user.verifyPassword(password, function (err, isMatch) {
				if (err) { return callback (err); }
				
				// Password did not match
				if (!isMatch) { return callback(null, false); }
				
				// Success
				return callback(null, user);
			})
		});
	}
));

exports.isAuthenticated = passport.authenticate(['local', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });