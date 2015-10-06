// Load required packages
var User = require('mongoose').model('User'),
	express = require('express'),
	router = express.Router();

// Create endpoint /api/users for POST
router.post('/users', function (req, res, next) {
	var user = new User({
		username: req.body.username,
		password: req.body.password
	});
	
	user.save(function (err) {
		if (err) {
			return next(err);
		}
		
		res.json({ message: 'New user added!' });
	});
});

// Create endpoint /api/users for GET
router.get('/users', function (req, res, next) {
	User.find(function (err, users) {
		if (err) {
			return next(err);
		}
		
		res.json(users);
	});
});

module.exports = router;
