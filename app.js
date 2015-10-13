/// <reference path="./typings/tsd.d.ts"/>

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    serveStatic = require('serve-static');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
/*
app.use(express.static(path.join(__dirname, 'public')));
*/
app.use(serveStatic(path.join(__dirname, 'public')));

// Use express session support since OAuth2orize requires it
app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}))

// setup database
var db = require('./models/mongodb/db'),
    user = require('./models/mongodb/user'),
    client = require('./models/mongodb/client'),
    code = require('./models/mongodb/code'),
    token = require('./models/mongodb/token'),
    video = require('./models/mongodb/video');

// setup authentication
app.auth = require('./controllers/auth-strategy');

// Use the passport package in our application
app.use(passport.initialize());

// setup routes
var routes = require('./controllers/routes');
app.use('/', routes);

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
    app.use(errorHandlerDevelopment);
}

// production error handler
// no stacktraces leaked to user

function errorHandlerProduction(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
}

app.use(errorHandlerProduction);


module.exports = app;
