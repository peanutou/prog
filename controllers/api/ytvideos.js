// Load required packages
var https = require('https');
/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports;

// Create endpoint /api/users for POST
exports.getVideoInfo = function (req, res, next) {
	var videoId = req.params.video_id;
	var url = ' https://www.youtube.com/get_video_info?video_id=' + videoId + '&asv=2';
	var videoData = '';
	
	var request = https.get(url, function(response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			videoData += chunk.toString();
		});		
		response.on('end', function () {
			videoData = decodeURI(videoData);
			var videoInfo = getQueryParams(videoData);
			var url_encoded_fmt_stream_map = decodeURI(videoInfo.url_encoded_fmt_stream_map)
			var url_encoded_fmt_stream_map_array = url_encoded_fmt_stream_map.split(/;\+/g);
			url_encoded_fmt_stream_map_array = url_encoded_fmt_stream_map_array.map(function (o) {
				return decodeURIComponent(o);
			});
			videoInfo.url_encoded_fmt_stream_map = url_encoded_fmt_stream_map_array;

			res.send(videoInfo.url_encoded_fmt_stream_map[0]);
		});
		response.on('error', function (e) {
			res.send(e);
		});
	});

	request.on('error', function (e) {
		console.log('problem with request: ' + e.message);
		res.send(e);
	});
};

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');

	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
} 
