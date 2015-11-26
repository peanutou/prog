// Load required packages
var Video = require('mongoose').model('Video');
var http = require('http');

/**
 * Export default singleton
 * 
 * @api public
 */
exports = module.exports;

// Create endpoint /api/videos for POST
exports.postVideos = function (req, res, next) {
	var video = new Video ({
		source: req.body.source,
		id: req.body.id,
		title: req.body.title,
		captionFile: req.body.caption_file,
		videoFile: req.body.video_file,
		coverFile: req.body.cover_file,
		userId: req.user._id
	});
	
	video.save( function (err, result) {
		if (err) {
			return res.send(err);
		}
		
		res.json({
			message: 'New video addes!',
			data: result
		});
	});
};

// Create endpoint /api/videos for GET
exports.getVideos = function (req, res, next) {
	Video.find(function (err, videos) {
		if (err) {
			return res.send(err);
		}
		
		res.json(videos);
	})	
};

// Create endpoint /api/videos/get_file_size for GET
exports.getVideoSize = function (req, res, next) {
	
	var video_url = req.params.url,
		reg = /((https?:\/\/)?([^\/]*))(.*)/,
		strings = reg.exec(video_url),
		hostname = strings[3],
		path = strings[4],  
		port = 80,
		data = '';
	
	// http://video.kk8.cdn.bj.xs3cnc.com/2c/i/videos_720P/05dsjgl-big%20data%20opportunity%20and%20challenge.mp4

	console.log(strings);
		
	var options = {
			hostname: hostname,
			port: port,
			path: path,
			method: 'HEAD',
			headers: {
				accept: '*/*'
			}
		};	
		
	var request = http.request(options, function(response) {
		res.send({
					size: response.headers['content-length']
				 });		
	});

	request.on('error', function (e) {
		console.log('problem with request: ' + e.message);
		res.send(e);
	});
	
	request.end();	
}