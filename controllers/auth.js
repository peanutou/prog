// Load require packages
var passport = require('passport');

/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports;

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });