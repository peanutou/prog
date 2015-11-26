// Load required packages
var express = require('express'),
	router = express.Router(),
	auth = require('./auth'),
	oauth2 = require('./oauth2');
	
// setup controllers
var index = require('./index'),
    users = require('./api/users'),
	clients = require('./api/clients'),
	videos = require('./api/videos'),
	ytvideos = require('./api/ytvideos'), 
	x2 = require('./api/x2');

// TODO:// 设置跨域访问 
/*
router.all('*', function (req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
	//res.header("X-Powered-By",' 3.2.1') 
	//res.header("Content-Type", "application/json;charset=utf-8"); 
	next(); 
}); 
*/

// Create endpoint handlers for users
router.route('/api/users')
	.post(users.postUsers)
	.get(auth.isAuthenticated, users.getUsers);

// Create endpoint handlers for clients
router.route('/api/clients')
	.post(auth.isAuthenticated, clients.postClients)
	.get(auth.isAuthenticated, clients.getClients);
	
// Create endpoint handlers for videos
router.route('/api/videos')
	.post(auth.isAuthenticated, videos.postVideos)
	.get(auth.isAuthenticated, videos.getVideos);

// Create endpoint handlers for x2
router.route('/api/x2/:content_type/:query_string')
	.get(auth.isAuthenticated, x2.get_x2);
router.route('/api/x2/:content_type')
	.get(auth.isAuthenticated, x2.get_x2);

// Create endpoint handlers for get_video_size
router.route('/api/videos/get_video_size/:url')
	.get(auth.isAuthenticated, videos.getVideoSize);
	
// Create endpoint handlers for oauth2 authorize
router.route('/api/oauth2/authorize')
	.get(auth.isAuthenticated, oauth2.authorization)
	.post(auth.isAuthenticated, oauth2.decision);
	
// Create endpoint handlers for youtube video info
router.route('/api/ytvideos/:video_id')
	.get(auth.isAuthenticated, ytvideos.getVideoInfo);

// Create endpoint handlers for oauth2 token
router.route('/api/oauth2/token')
	.post(auth.isClientAuthenticated, oauth2.token);

router.route('/*')
	.all(index.allIndex)
	
module.exports = router;