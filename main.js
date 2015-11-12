var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var helloworld = require('./routes/helloworld');

var app = express();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME || 'localhost',
  user     : process.env.RDS_USERNAME || 'testuser',
  password : process.env.RDS_PASSWORD || 'password',
  port     : process.env.RDS_PORT || '3306',
});

connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db' + err);
    return;
  }
  console.log('Connection established');
});

var result;

connection.query('CREATE DATABASE eb_db', function(err, rows, fields) {
  if (!err) {
    console.log("Successfully created database 'eb_db'!");
  } else {
    console.log("Error while creating a database!" + err);
  }
});

connection.query('use eb_db', function(err, rows, fields) {
  if (!err) {
    console.log("Using 'eb_db'!");
  } else {
    console.log("Error while creating a database!" + err);
  }
});

connection.query('CREATE TABLE customers (first_name TEXT, last_name TEXT)', function(err, rows, fields) {
  if (!err) {
    console.log("Successfully created table 'customers'!");
  } else {
    console.log("Error while creating a table! " + err);
  }
});

connection.query('INSERT INTO customers (first_name, last_name) VALUES ("Nikola", "Djuza")', function(err, rows, fields) {
  if (!err) {
    console.log("Successfully inserted a row into 'customers'!");
  } else {
    console.log("Error while inserting a row! " + err);
  }
});

connection.query('SELECT * from customers', function(err, rows, fields) {
  if (!err) {
    setRowsValue(rows);
  } else
    console.log('Error while performing Query.' + err);
});

function setRowsValue(value) {
  result = value;
  console.log('The solution is: ', result);
}

connection.end();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/helloworld', helloworld);

var router = express.Router();

/* GET home page. */
console.log(result);
router.get('/', function(req, res, next) {
  connection.query('SELECT * from customers', function(err, rows, fields) {
    if (!err) {
      setRowsValue(rows);
    } else
    console.log('Error while performing Query.');
  });
  res.render('helloworld', { title: 'Hello world!',
                             result: result});
});

module.exports = router;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
