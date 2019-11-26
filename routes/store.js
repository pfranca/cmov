var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var crypto = require('../utils/encryption');
const db = require('../config/database');

router.post('/updateKey', function(req, res, next) {

    let pubKey = req.body.pub;
  
  
    db.query('UPDATE user SET checkoutKey=?',[pubKey],function(err, result, fields){
      db.on('error', (err) => {
        console.log('[MySQL ERROR]', err);
      });
      if(result)
      console.log(result);
        res.json(result);
    });
  
  });

  router.post('/makePurchase', function(req, res, next) {

    let data = req.body;
    console.log(data)
  
  
    db.query('INSERT INTO `transactions`(`userUuid`, `total`, `discount`, `created_at`) VALUES (?,?,?,NOW())',
 [data.uuid, data.total, data.voucher],function(err, result, fields){
                  db.on('error', (err) => {
                    console.log('[MySQL ERROR]', err);
                    res.json('Register error:', err);
                  });
                  //console.log(result);
                  //console.log(fields);
                  res.status(200);
      })
  
  });



module.exports = router;