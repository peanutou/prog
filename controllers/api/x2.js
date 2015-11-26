// Load required packages
var http = require('http');
var querystring = require('querystring');
/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports;

var x2_user_name = 'admin';
var x2_api_key = 'gM7BJN2CvYFaxBTzb9K8I5OUMCDgkHPT';
var x2_auth = 'Basic ' + new Buffer(x2_user_name + ':' + x2_api_key).toString('base64')
var x2_object_name = ['Content_Internet', 'Content_Product', 'Content_Operating', 'Content_Marketing', 'Content_Entrepreneur', 'Content_Photography'];

function _get_x2_data(params, req, res, next) {

	var path = encodeURI(decodeURIComponent('/index.php/api2/' + 
				params.type + 
				(params.attributes ? ('/by:' + params.attributes + '.json') : ''))),  
		port = 9092,
		hostname = 'cms.uniquedu.com',
		data = '';
		
	var options = {
			hostname: hostname,
			port: port,
			path: path,
			method: 'GET',
			auth: x2_user_name + ':' + x2_api_key,
			headers: {
				accept: '*/*'
			}
		};	
		
	var request = http.request(options, function(response) {
		
		response.setEncoding('utf8');
		
		// response.setEncoding('utf8');
		response.on('data', function(chunk) {
			data += chunk.toString();
		});
		response.on('end', function() {
			res.send(data);			
		})
	});

	request.on('error', function (e) {
		console.log('problem with request: ' + e.message);
		res.send(e);
	});
	
	request.end();	
}

// Create endpoint /api/x2/ for GET
exports.get_x2 = function(req, res, next) {
	
	var type = req.params.content_type;
	var query_string = (req.params.query_string ? (req.params.query_string) : null);
	console.log(escape(query_string));
	var type_index = parseInt(type);
	var object_name = x2_object_name[type_index];
	
	_get_x2_data({
			type: object_name,
			attributes: query_string
		}, req, res, next);
}