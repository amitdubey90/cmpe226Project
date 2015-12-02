var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


//set-up connection to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://cmpe226:project226@ds057934.mongolab.com:57934/productcatalog');

//import mongoose models
require('./model/catalogModel');

var routes = require('./routes/index');
var catalog = require('./routes/catalog');
var rest = require('./routes/rest');
var adminDashBoard = require('./routes/adminDashBoard');
var adminrest= require('./routes/adminrest');


//init express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookie: {
    path    : '/',  // important !!
    httpOnly: false,
    maxAge  : 24*60*60*1000
  },
  secret: '1234567890QWERT'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
});

app.use('/user', routes);
app.use('/browse', catalog);
app.use('/rest', rest);
app.use('/adminDashBoard', adminDashBoard);
app.use('/adminrest', adminrest);
app.use('/', function(req, res, next) {
    res.render('index');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
