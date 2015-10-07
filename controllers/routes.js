// Load required packages
var express = require('express'),
	router = express.Router(),
	auth = require('./auth'),
	oauth2 = require('./oauth2');
	
// setup controllers
var index = require('./index'),
    users = require('./api/users'),
	clients = require('./api/clients');
	
router.all('/', index);

router.route('/api/users')
	.post(users.postUsers)
	.get(auth.isAuthenticated, users.getUsers);

router.route('/api/clients')
	.post(auth.isAuthenticated, clients.postClients)
	.get(auth.isAuthenticated, clients.getClients);
	
// Create endpoint handlers for oauth2 authorize
router.route('/api/oauth2/authorize')
	.get(auth.isAuthenticated, oauth2.authorization)
	.post(auth.isAuthenticated, oauth2.decision);
	
// Create endpoint handlers for oauth2 token
router.route('/api/oauth2/token')
	.post(auth.isClientAuthenticated, oauth2.token);
	
module.exports = router;