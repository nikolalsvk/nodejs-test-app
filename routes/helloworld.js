var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME || 'localhost',
    user     : process.env.RDS_USERNAME || 'testuser',
    password : process.env.RDS_PASSWORD || 'password',
    port     : process.env.RDS_PORT || '3306',
  });

  console.log("Port: ", process.env.RDS_PORT);

  connection.connect(function(err){
    if(err){
      console.log('Error connecting to Db' + err);
      return;
    }
    console.log('Connection established');
  });

  var result;

  connection.query('use eb_db', function(err, rows, fields) {
    if (!err) {
      console.log("Using 'eb_db'!");
    } else {
      console.log("Error while creating a database!" + err);
    }
  });

  connection.query('SELECT * from customers', function(err, rows, fields) {
    if (!err) {
      setRowsValue(rows);
      // render helloworld.jade
      res.render('helloworld', { title: 'Hello world!',
                                 customers: rows.json });
    } else
    console.log('Error while performing Query.' + err);
  });

  connection.end();
});

function setRowsValue(value) {
  result = value;
  console.log('The solution is: ', result);
}

module.exports = router;
