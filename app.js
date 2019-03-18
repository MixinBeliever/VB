var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var releaseRouter = require('./routes/release');
var myAccountRouter = require('./routes/myAccount');
var testRouter = require('./routes/test');
var collectRouter = require('./routes/collect');
var picFormRouter = require('./routes/picForm');
var changepwdRouter = require('./routes/changepwd');
var profileRouter = require('./routes/profile');




var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vb_db');

var session = require('express-session');

var app = express();

// view engine setup
// 配置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  name: 'userSessionID',
  secret: 'vb123vb',
  cookie: {maxAge: 1000*60*60*24*3},
  resave: true,
  saveUninitialized: false
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/release',releaseRouter);
app.use('/myAccount',myAccountRouter);
app.use('/test',testRouter);
app.use('/collect',collectRouter);
app.use('/picForm',picFormRouter);
app.use('/changepwd',changepwdRouter);
app.use('/profile',profileRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
