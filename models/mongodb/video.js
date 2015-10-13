// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var SchemaVideo = new mongoose.Schema({
	title: { type: String, unique: true, required: true },
	source: { type: String, required: true },
	id: { type: String, required: true },
	userId: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Video', SchemaVideo);