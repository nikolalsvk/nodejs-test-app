var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
      user     : 'testuser',
      password : 'password',
      database : 'testdb'
  });

  connection.connect(function(err){
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  var result;

  connection.query('SELECT * from customers', function(err, rows, fields) {
    if (!err) {
      setRowsValue(rows);
      // render helloworld.jade
      res.render('helloworld', { title: 'Hello world!',
                                 result: rows[0].first_name });
    } else
    console.log('Error while performing Query.');
  });

  connection.end();
});

function setRowsValue(value) {
  result = value;
  console.log('The solution is: ', result);
}

module.exports = router;
