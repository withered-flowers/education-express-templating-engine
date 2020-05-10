// Di sini kita akan menggunakan express Router
const express = require('express');
const router = express.Router();

// Jangan lupa untuk memindahkan fs ke sini
const fs = require('fs');

// Di sini semua yang awalnya app.get atau app.post
// kita ganti menjadi router.get atau router.post
// Kemudian karena endpoint ini akan kita assign 
// `awalannya` pada app.js kita, maka awalannya tersebut
// akan kita buang, dalam hal ini awalannya adalah
// /user <---- akan kita replace menjadi / saja

router.get('/', function userGETHandler(req, res) {
  let data = fs.readFileSync('./0-generated.json', 'utf-8');
  data = JSON.parse(data);

  res.render('user', { 
    dataUser: data 
  });
});

router.get('/get-form', function userGETformRender(req, res) {
  res.render('user-input');
});

router.get('/get-form-handler', function userGETformHandler(req,res) {
  res.send(req.query["label-nama"]);
});

router.post('/get-form-handler', function userGETformHandler(req, res) {
  console.log(`Username: ${req.body['label-nama']}`);
  console.log(`Password: ${req.body['label-password']}`);
  
  res.redirect('/user/get-form');
});

// Jangan lupa untuk mengexport karena kita akan menggunakan ini pada app.js
module.exports = router;