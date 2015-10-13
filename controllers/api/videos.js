// Load required packages
var Video = require('mongoose').model('Video');

/**
 * Export default singleton
 * 
 * @api public
 */
exports = module.exports;

// Create endpoint /api/videos for POST
exports.postVideos = function (req, res, next) {
	var video = new Video ({
		title: req.body.title,
		source: req.body.source,
		id: req.body.id,
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
