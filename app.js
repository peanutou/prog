/// <reference path="./typings/tsd.d.ts"/>

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    oauthserver = require('oauth2-server'),
    oauthmodel = require('./model/mongodb/oauth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup database
var db = require('./model/mongodb/db'),
    user = require('./model/mongodb/user');

// setup authentication
app.oauth = oauthserver({
  model: oauthmodel,
  grants: ['password'],
  debug: app.get('env') === 'development' ? true : false
});
app.auth = require('./routes/api/auth');

// Use the passport package in our application
app.use(passport.initialize());

// setup routes
var routes = require('./routes/index'),
    users = require('./routes/api/users');

app.all('/oauth/token', app.oauth.grant());
app.use('/api', users);
app.use('/auth', app.auth.isAuthenticated, routes);
app.use('/', app.oauth.authorise(), routes);
app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

function errorHandlerDevelopment(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
}

if (app.get('env') === 'development') {
  //app.use(errorHandlerDevelopment);
}

// production error handler
// no stacktraces leaked to user

function errorHandlerProduction(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
}

app.use(errorHandlerProduction);


module.exports = app;
