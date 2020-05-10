const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use('/asset', express.static('public2'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

app.get('/user', function userGETHandler(req, res) {
  let data = fs.readFileSync('./0-generated.json', 'utf-8');
  data = JSON.parse(data);

  res.render('user', { 
    dataUser: data 
  });
});

app.get('/user/get-form', function userGETformRender(req, res) {
  res.render('user-input');
});

app.get('/user/get-form-handler', function userGETformHandler(req,res) {
  res.send(req.query["label-nama"]);
});

app.post('/user/get-form-handler', function userGETformHandler(req, res) {
  console.log(`Username: ${req.body['label-nama']}`);
  console.log(`Password: ${req.body['label-password']}`);
  
  res.redirect('/user/get-form');
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});