var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

global.__basedir = __dirname;

let envPath;
if (process.env.NODE_ENV === 'production') {
  envPath = `${__dirname}/config/.env.prod`;
} else {
  envPath = `${__dirname}/config/.env.dev`;
}
dotenv.config({path: envPath});

var userRouter = require('./routes/user');
var BroadcastRouter = require('./routes/broadcast');
var channelRouter = require('./routes/channel');
var linkRouter = require('./routes/link');
var programRouter = require('./routes/program');
var cableRouter = require('./routes/cable');
var bannerRouter = require('./routes/banner');
var scheduleRouter = require('./routes/schedule');
var boardRouter = require('./routes/board');
var contactRouter = require('./routes/contact');

var app = express();
var seed = require('./seeds/index')

var sequelize = require('./models/index').sequelize;
sequelize.sync()
// sequelize.sync({force: true})
  .then(() => {
    console.log('DB connect success!');
    return seed()
  })
  .catch(err => {
    console.log('DB connect failed!');
    console.log(err);
  })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'upload')));

// route
app.get('/', (req, res) => res.send('example API'));
app.use('/api/user', userRouter);
app.use('/api/broadcast', BroadcastRouter);
app.use('/api/channel', channelRouter);
app.use('/api/link', linkRouter);
app.use('/api/program', programRouter);
app.use('/api/cable', cableRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/board', boardRouter);
app.use('/api/contact', contactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error('[ERROR] ', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json('Server Error');
});

module.exports = app;
