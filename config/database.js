const mysql = require('mysql');

//Create Connection
const db = mysql.createConnection({
  host: 'us-cdbr-iron-east-05.cleardb.net',
  user: 'b7ecfb994f5dae',
  password: '87e7b9f4',
  database: 'heroku_64569440f50a48b'
});

module.exports = db;