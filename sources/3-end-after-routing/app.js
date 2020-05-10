const express = require('express');
const app = express();

const PORT = 3000;

// Di sini kita akan memanggil rute tambahan yang ada.
const user = require('./routes/user-route');

app.use(express.static('public'));
app.use('/asset', express.static('public2'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

// Di sini kita akan meng-assign semua rute yang ada pada `user-route` untuk
// menerima awalan rute dengan nama /user
app.use('/user', user);

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});