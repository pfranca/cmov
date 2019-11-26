var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var crypto = require('../utils/encryption');
const db = require('../config/database');

/* GET user info. */
router.get('/:uuid', function(req, res, next) {

  let clientUuid = req.params.uuid;
  
  db.query('SELECT * FROM user where unique_id=?',[clientUuid],function(err, result, fields){
    db.on('error', (err) => {
      console.log('[MySQL ERROR]', err);
    });
      let username = result[0].username;
      let name = result[0].name;
      let cardNumber =result[0].cardNumber;
      let cardCcv =result[0].cardCcv;
      let cardDate =result[0].cardDate; 
 

      res.json({'username':username, 'name':name, 'cardNumber':cardNumber, 'cardCcv': cardCcv, 'cardDate':cardDate});
    
  });
});

router.get('/storePk/:uuid', function(req, res, next) {

  let clientUuid = req.params.uuid;
  
  db.query('SELECT * FROM user where unique_id=?',[clientUuid],function(err, result, fields){
    db.on('error', (err) => {
      console.log('[MySQL ERROR]', err);
    });
      let storeKey = result[0].checkoutKey;
 
 

      res.json({'storeKey':storeKey});
    
  });
});

/* POST clinet register. */
router.post('/register', function(req, res, next) {

  let data = req.body;

  let uid = uuid.v4();
  let plaint_password = data.password;
  let hash_data = crypto.saltHashPassword(plaint_password);
  let password = hash_data.passwordHash;
  let salt = hash_data.salt;

  let name = data.name;
  let username = data.username;
  let cardNumber = data.cardNumber;
  let cardCcv = data.cardCcv;
  let cardDate = data.cardDate;

  db.query('SELECT * FROM user where username=?',[username],function(err, result, fields){
    db.on('error', (err) => {
      console.log('[MySQL ERROR]', err);
    });
    if(result && result.length)
      res.json('Username already taken!');
    else
    {
      db.query('INSERT INTO `user`(`unique_id`, `name`, `username`, `encrypted_password`, `salt`, `cardNumber`, `cardCcv`, `cardDate`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())',
 [uid, name, username, password, salt, cardNumber, cardCcv, cardDate],function(err, result, fields){
                  db.on('error', (err) => {
                    console.log('[MySQL ERROR]', err);
                    res.json('Register error:', err);
                  });
                  //console.log(result);
                  //console.log(fields);
                  res.send({'uuid':uid.toString()});
      })
    }
  });

});

router.post('/login', function(req, res, next){

  let data = req.body;


  let user_password = data.password;
  let username = data.username;

  db.query('SELECT * FROM user where username=?',[username],function(err, result, fields){
    db.on('error', (err) => {
      console.log('[MySQL ERROR]', err);
    });
    if(result && result.length){
      let salt = result[0].salt;
      let encrypted_password = result[0].encrypted_password;
      let hashed_password = crypto.checkHashPassword(user_password, salt).passwordHash;
      if(encrypted_password == hashed_password)
        res.end(JSON.stringify(result[0]));
      else
        res.end(JSON.stringify('Wrong password'));
    }
    else
    {
      res.json('Login sucessful');
    }
  });

});

router.get('/transactions/:uuid', function(req,res, next) {

  let clientUuid = req.params.uuid;
  let responseJson;
  
  db.query('SELECT * FROM transactions where userUuid=?',[clientUuid],function(err, result, fields){
    db.on('error', (err) => {
      console.log('[MySQL ERROR]', err);
    });

    // /console.log(result);

    for(let i=0; i< result.length; i++){
      let content = result[i].content;
      let costEur = result[i].costEur;
      let costCent =result[i].costCent;
      let discount =result[i].discount;
      let date =result[i].created_at;
      
      let insideJson = {'content':content, 'costEur':costEur, 'costCent':costCent, 'discount': discount, 'date':date};
      if(i == (result.length-1)){
        responseJson += insideJson;
      }else{
        responseJson += insideJson;
        responseJson += ',';
      }
    }

    //console.log(JSON.);
    res.json(responseJson);
});
});

module.exports = router;
