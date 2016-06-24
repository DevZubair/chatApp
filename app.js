var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var q = require("q");
var lodash  = require('lodash');
var busboy = require('connect-busboy');

var app = express();
var router = express.Router();



var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


app.use(logger('dev'));
app.use(busboy());                  //use for file uploading
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(cookieParser());
app.use('/', router);

app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");//false
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-access-id");
  next();
});


/**
 * Created by Zubair.
 */

/*The Whole Application Files*/
require('./config')(mongoose, app);
require('./app/models')(app, mongoose);
require('./app/enums')(app);
require('./app/services')(app, q, lodash);
require('./app/controllers')(app, q, lodash);
require('./app/routes')(app, router);
/*The Whole Application Files*/



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
