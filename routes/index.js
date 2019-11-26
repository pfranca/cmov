var express = require('express');
var router = express.Router();
const db = require('../config/database');
const encrypt = require('../utils/encryption');

/* GET home page. */
router.get('/', function(req, res, next) {
 /* let sql = 'SELECT * FROM users';
  let query = db.query(sql, (err, results) =>{
    if(err) throw err;
    console.log (results);
  })
  */
  let test = encrypt.saltHashPassword("12345");
  console.log("pass = 12345");
  console.log("hashedpass = " +test.passwordHash);
  console.log("hashedpass = " +test.salt);
  res.render('index', { title: 'Express' });
});

module.exports = router;
