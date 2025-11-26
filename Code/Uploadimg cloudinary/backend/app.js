require('dotenv').config();
var express = require('express');
var app = express();

var createError = require('http-errors');

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var logger = require('morgan');
app.use(logger('dev'));

var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

const cors = require('cors');
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve static file
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadRouter);

app.use(function(req, res, next) {
  console.log("Run here");
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log(req.app.get('env'));
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error'); 
});

module.exports = app;