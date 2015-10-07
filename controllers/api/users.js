// Load required packages
var User = require('mongoose').model('User');

/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports;

// Create endpoint /api/users for POST
exports.postUsers = function (req, res, next) {
	var user = new User({
		username: req.body.username,
		password: req.body.password
	});
	
	user.save( function (err, result) {
		if (err) {
			return res.send(err);
		}

		res.json({ 
			message: 'New user added!', 
			data: result 
		});
	});
};

// Create endpoint /api/users for GET
exports.getUsers = function (req, res, next) {
	User.find(function (err, users) {
		if (err) {
			return res.send(err);
		}
		
		res.json(users);
	});
};
