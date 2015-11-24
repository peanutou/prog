// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var SchemaVideo = new mongoose.Schema({
	source: 		{ type: String, unique: false, required: true },
	id: 			{ type: String, unique: false, required: true },
	title: 			{ type: String, unique: false, required: true },
	captionFile: 	{ type: String, unique: false, required: false },
	videoFile: 		{ type: String, unique: false, required: false },
	coverFile: 		{ type: String, unique: false, required: false },
	userId: { type: String, unique: false, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Video', SchemaVideo);