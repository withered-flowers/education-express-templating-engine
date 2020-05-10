## Table of Content
1. [Recap express](#recap-express)
1. [How to use nodemon](#how-to-use-nodemon)
1. [Template Engine - EJS](#template-engine---ejs)
    * HTML + EJS
    * res.render
    * Form
1. [Handling Route Post](#handling-route-post)
    * Intro middleware
      * Built-in middleware
        * static
        * body-parser + req.body
    * res.redirect
1. [Express Router](#express-router)
1. [Reference](#reference)

## Recap express
Pada pembelajaran sebelumnya, kita sudah mengetahui bagaimana cara menggunakan
express secara `backend`-ly, masih dalam bentuk tulisan biasa saja, belum 
menggunakan tampilan layaknya web yang kita jelajahi pada umumnya.

Pada pembelajaran ini kita akan membuat sebuah web sederhana yang dapat menerima
input dari pengguna dan memanipulasi inputan tersebut di dalam aplikasi yang
kita buat.

Untuk itu, pertama-tama mari kita recap penggunaan `express` terlebih dahulu.

Cara membuat apps berbasis Express Framework:
1. `npm init -y`
1. `npm install express`
1. membuat file `.gitignore`
1. Membuat starter code dengan nama `app.js` seperti [Code 01](#code-01)

### Code 01
```javascript
const express = require('express');
const app = express();

// Default port aplikasi express
// Port untuk development jangan di bawah 1024, 
// reserved for system usage (well-known ports)
const PORT = 3000;

// Setting endpoint dari sini
app.get('/', function rootGETHandler(req, res) {
  res.send("Hello World");
});

// app.listen(port, callback)
// digunakan untuk meng-serve aplikasi web yang dibuat pada port tertent
app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Kemudian kode di atas kita jalankan dengan `node app.js` dan membuka browser
kesayangan kita dengan menuliskan `http://localhost:3000/` maka aplikasi 
akan menampilkan tulisan `Hello World` pada browser kesayangan kita. 

## How to use nodemon
Masih dengan kode yang ada di atas, misalkan kita ingin mengganti kata `World`
menjadi `Root` [Code 02](#code-02)

### Code 02
```javascript
const express = require('express');
const app = express();

// Default port aplikasi express
// Port untuk development jangan di bawah 1024, 
// reserved for system usage (well-known ports)
const PORT = 3000;

// Setting endpoint dari sini
app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

// app.listen(port, callback)
// digunakan untuk meng-serve aplikasi web yang dibuat pada port tertent
app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Kemudian kita menyimpan code tersebut dan me-refresh browser kita.

Apa yang terjadi?  
Masih muncul dengan kode lama kita bukan?   
Tulisan `Hello World`

Mengapa hal ini terjadi?  
Hal ini terjadi karena kita belum mematikan aplikasi kita (CTRL atau CMD + C)
di CLI kita. Apabila kita mengubah kode kita, harus mematikan aplikasi dan 
menjalankannya kembali.

`Repot sekali bukan?`

Please welcome penyelamat kita ! - `nodemon`

Nodemon adalah sebuah `tools` populer pada nodejs untuk memonitor perubahan yang
ada pada kode kita dan secara otomatis me-`restart` server kita. Sangat cocok 
digunakan pada tahap `development` bukan?

Cara menginstallnya bisa dengan 2 cara:
1. Dengan meng-install nodemon secara global (`npm install -g nodemon`)
2. Dengan meng-install nodemon dalam package `dev` di aplikasi kita 
   (`npm install -D nodemon`)

Cara ini keduanya punya plus minusnya:
* Untuk instalasi secara `global`, enaknya 1x pasang saja beres, `fire and forget`,
  kelemahannya harus memiliki access administrator (privilege tambahan)
* Untuk instalasi `dev` package kelemahannya adalah setiap kali kita membuat apps
  baru, kita harus menginstall ulang lagi nodemonnya, dan cara menjalankannya
  berbeda.

Untuk menjalankan aplikasi kita dengan nodemon sekarang:
* Untuk yang menginstall `global` tinggal mengetikkan `nodemon app.js`
* Untuk yang menginstall `dev` ketikkan `npx nodemon app.js`
  (perhatikan `npx` bukan `npm` yah !)

Pada pembelajaran ini, kita gunakan cara `dev`, dikarenakan penulis tidak memiliki
akses administrator pada komputer yang digunakan.

## Template Engine - EJS
Sekarang misalkan kita akan menambahkan endpoint `user` pada apps kita untuk
membaca file `0-generated.json` yang ada pada folder aplikasi kita, maka kode di 
atas akan kita ubah menjadi seperti [Code 03](#code-03)

### Code 03
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

app.get('/user', function userGETHandler(req, res) {
  let data = fs.readFileSync('./0-generated.json', 'utf-8');
  data = JSON.parse(data);

  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Dengan menggunakan kode di atas, kita sudah bisa menampilkan data dalam bentuk
`json` pada browser kita. Tapi apakah kita mau data kita ditampilkan dalam bentuk
`json` terus terusan pada browser kita?

Tentunya tidak mau bukan? maunya dalam bentuk tampilan yang lebih *kece* atau 
lebih indah bukan?

Bagaimana cara kita menampilkannya pada Express ini?  
Jawabannya adalah dengan menggunakan `Templating Engine`

`Templating Engine` akan mengkonversikan file statis kita ditambahkan dengan 
data yang kita miliki, untuk dikonversikan menjadi bentuk yang bisa dibaca oleh
client / browser kita (HTML).

Ada banyak `templating engine` yang didukung oleh Express seperti `pug`, `mustache`,
`ejs`, dan lain lain.

Yang akan digunakan dalam pembelajaran ini adalah dengan `ejs`.

Untuk dapat menggunakan `ejs` kita akan meng-install module `ejs` dan 
meng-implementasikannya pada kode `app.js` yang dapat dilihat pada 
[Code 04](#code-04)

Instalasi `ejs`:  
`npm install ejs`

### Code 04
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

// kita minta express untuk menggunakan ejs
// Nanti dari express yang akan require,
// kita tidak usah menuliskan require ejs lagi.
app.set('view engine', 'ejs');

app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

app.get('/user', function userGETHandler(req, res) {
  let data = fs.readFileSync('./0-generated.json', 'utf-8');
  data = JSON.parse(data);

  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Setelah belajar mengenai bagaimana me-`minta` Express menggunakan `ejs`, sekarang
kita akan belajar untuk mengimplementasikan `ejs`.

### HTML + EJS
EJS atau `Embedded Javascript`, sesuai namanya, merupakan template di mana kita
menyisipkan `javascript` di dalam `HTML` dengan format dan cara tertentu.

Dalam express sendiri, semua file `tampilan` dalam hal ini adalah file `ejs`-nya
sendiri diletakkan pada folder `views`

Jadi sekarang pada folder apps yang kita buat, tambahkan sebuah sub-folder dengan
nama `views` kemudian kita akan membuat sebuah file dengan nama `user.ejs`
(Perhatikan ekstensi filenya adalah `ejs` yah !)

Contoh file `user.ejs` bisa dilihat pada [Code 05](#code-05)

### Code 05
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaman User</title>
  <!-- Untuk menambahkan CSS / kosmetik tampilan -->
  <link rel="stylesheet" type="text/css" href="...">

  <!-- Untuk menambahkan script js tambahan -->
  <script type="text/javascript" src="..."></script>
</head>
<body>
  <!-- Data kita akan kita tuliskan di sini -->
  Hello World
  
  <!--
    contoh scriptlet <% %> dan <%= %>
  -->
  <table>
    <thead>
      <tr>
        <td>
          Nomor Urut
        </td>
      </tr>
    </thead>
    <tbody>
      <% for(let i=0; i<5; i++) { %>
        <tr>
          <td> <%= i %> </td>
        </tr>
      <% } %>
    </tbody>
  </table>

</body>
</html>
```

Perhatikan dari kode di atas, bahwa setiap tag `<...>` akan ada pasangan penutupnya
`/<...>`

### res.render
Setelah kita membuat tampilan `ejs`-nya, sekarang kita akan menyatukan data yang
kita miliki pada `endpoint` express kita, dengan `ejs` yang sudah kita buat.

Express menyediakan sebuah fungsi yang bernama `res.render` untuk melakukan hal ini.
https://expressjs.com/en/api.html#res.render

Sehingga berdasarkan dokumentasi di atas, kode `app.js` kita akan berubah menjadi
seperti [Code 06](#code-06)

```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', function rootGETHandler(req, res) {
  res.send("Hello Root");
});

app.get('/user', function userGETHandler(req, res) {
  let data = fs.readFileSync('./0-generated.json', 'utf-8');
  data = JSON.parse(data);

  // Menggantikan res.send
  // menjadi res.render
  // di sini file nya sama dengan yang ada di folder views
  // dan gunakan tanpa ekstensi belakangnya
  res.render('user', { 
    dataUser: data 
  });
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Setelah berhasil mem-`passing` data via `res.render` sekarang kita akan mengubah
file `user.ejs` supaya bisa membaca data yang telah di-`pass` tersebut.

Kita mengubah file `user.ejs` nya menjadi seperti [Code 07](#code-07)

### Code 07
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Halaman User</title>
  
  <link rel="stylesheet" type="text/css" href="...">
  <script type="text/javascript" src="..."></script>
</head>
<body>
  Hello World
  
  <table>
    <thead>
      <tr>
        <td>
          Nomor Urut
        </td>
      </tr>
    </thead>
    <tbody>
    <!-- 
      kita menangkap `dataUser` dari res.render di sini.
    -->
      <% for(let i = 0; i < dataUser.length; i++) { %>
        <tr>
          <td> <%= dataUser[i].name %> </td>
        </tr>
      <% } %>
    </tbody>
  </table>

</body>
</html>
```

Dari kode diatas, kita sudah berhasil membaca file dari json, kemudian menampilkan
via browser melalui tampilan non-`apa adanya` lagi yaitu dengan menggunakan 
`res.render` dan `ejs`. Namun hal yang ada di atas ini semuanya adalah dalam bentuk
`output`, bagaimana bila kita ingin menerima `input` dari tampilan yang 
terdapat pada client atau browser kita?

Solusinya adalah dengan menggunakan `Form` pada `ejs` kita.

### Form

Form merupakan suatu tag dalam HTML yang digunakan untuk menerima input dari user 
atau client atau browser untuk kemudian akan diproses ke backend / server untuk 
diproses kembali.

Misalkan dari kode yang ada di atas kita akan menambahkan sebuah file `ejs` dengan
nama `user-input.ejs` dengan kode yang dapat dilihat pada [Code 08](#code-08)

### Code 08
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <!-- Buat form start dari sini -->
  <form action="/user/get-form-handler" method="get">
    
    <label for="label-nama">Input Nama</label>
    <input type="text" id="label-nama" name="label-nama">

    <label for="label-password">Input Password</label>
    <input type="text" id="label-password" name="label-password">

    <button type="submit">Login</button>
  </form>
  <!-- End buat form -->
</body>
</html>
```

Setelah membuat `Form`-nya, sekarang kita akan coba untuk membuat `handler` 
pada aplikasi express yang kita miliki, dapat dilihat pada [Code 09](#code-09)

### Code 09
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

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

// Ini adalah app get untuk menampilkan form nya
app.get('/user/get-form', function userGETformRender(req, res) {
  res.render('user-input');
});

// Ini adalah app get untuk mengambil response dari form-nya
app.get('/user/get-form-handler', function userGETformHandler(req, res) {
// Cara untuk mendapatkan value dari input form yang memiliki hyphen atau dash
  res.send(req.query["label-nama"]);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Apabila apps yang kita buat untuk login terjadi seperti ini, maka tidak akan ada 
yang mau bukan (karena passwordnya terlihat kasat mata ?)

Lalu bagaimana cara kita mengakalinya?  
Ingat dalam `Form` ada 2 `method` yang umum digunakan, yaitu `GET` dan `POST`.

Sekarang kita akan coba untuk menggunakan method `POST` dalam kode kita.
Kita akan memodifikasi `user-input.ejs` dan `app.js` kita untuk diubah ke `POST`, 
kode dapat dilihat pada [Code 10](#code-10) dan [Code 11](#code-11)

### Code 10
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <!-- Ganti method form get menjadi post -->
  <form action="/user/get-form-handler" method="post">
    
    <label for="label-nama">Input Nama</label>
    <input type="text" id="label-nama" name="label-nama">

    <label for="label-password">Input Password</label>
    <input type="text" id="label-password" name="label-password">

    <button type="submit">Login</button>
  </form>
  
</body>
</html>
```

### Code 11
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

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

// Di sini kita mengganti app.get menjadi app.post
app.post('/user/get-form-handler', function userGETformHandler(req, res) {
  res.send(req.query["label-nama"]);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Kemudian kita coba untuk me-restart aplikasi kita dan kita coba jalankan 
(ulangi input dari `/user/get-form`) kemudian apa hasilnya?

Ya, hasilnya adalah ***putih bersih kinclong*** bukan? Tidak ada satu pun yang muncul.

Hal ini terjadi karena cara untuk meng-handle POST input pada Express *bukan*-lah 
dengan `req.query` !

## Handling Route Post
Kemudian bagaimana cara kita meng-handle POST input dari `ejs` ke `express` ?  
Sebelum kita meng-handle masalah ini, ada baiknya kita mengetahui terlebih dahulu
apa itu `Middleware` pada `express`.

### Intro to Middleware
Middleware adalah sebuah fungsi (hayo fungsi dalam fungsi, namanya apa?) yang memiliki
akses terhadap objek request `req` dan objek response `res`, dan sebuah fungsi 
selanjutnya *callback* yang dinamakan dengan `next` untuk memanipulasi / mendapatkan
suatu data yang ada.

Ada beberapa tipe Middleware, namun yang akan kita fokuskan di sini adalah middleware
yang sudah menjadi bawaan dalam express yaitu `express.static` dan `express.urlencoded` atau umumnya disebut dengan `body-parser`.

Penggunaan middleware umumnya adalah dengan menggunakan keyword `use`

Contoh:  
`app.use( middlewareFunctionHere );`

### express.static
Merupakan middleware yang digunakan pada express untuk menyediakan file statik atau
`asset` pada aplikasi kita yang berupa file / text / script / css atau gambar yang
diletakkan pada `folder` tertentu pada aplikasi kita.

Contoh penggunaannya (tidak dibahas terlalu dalam)

### Code 12
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

// Tambahkan penggunaan untuk penyedia asset di sini
// misalknya kita ingin meletakkan asset yang ada pada folder public
// dengan endpoint /public juga
app.use(express.static('public'));

// Apabila kita ingin menaruh pada folder public2
// namun mengaksesnya dari endpoint asset
app.use('/asset', express.static('public2'));

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
  res.send(req.query["label-nama"]);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Sehingga nanti, semua file tersebut bisa diakses oleh aplikasi yang kita buat via
endpoint `/public` untuk folder `public` dan `/asset` untuk folder `public2`

### body-parser + req.body
Kembali ke permasalahan sebelumnya, untuk dapat membaca data dari HTML Form dengan
method `post`, Express memperkenalkan sebuah middleware dengan nama `body-parser`.

Setelah menggunakan `body-parser` ini, data dapat diterima **BUKAN** dengan
`req.query` melainkan dengan mengakses `req.body`. Contoh kode perubahan pada `app.js`
dapat dilihat pada [Code 13](#code-13)

### Code 13
```javascript
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use('/asset', express.static('public2'));

// Middleware bawaan express yang digunakan untuk
// dapat menerima POST dari ejs
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
// Gunakan req.body, bukan req.query untuk mengambil input dari ejs form POST
  res.send(req.body["label-nama"]);
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Kemudian coba kita me-restart aplikasi kita kemudian kita isi form ulang lagi dari
endpoint `/user/get-form`, input `label-nama` sekarang sudah berhasil didapatkan 
bukan?

Selamat Anda sudah berhasil menguasai HTML Form dan cara untuk mendapatkan inputnya
sampai di sini !

Kemudian selanjutnya, kita telusuri kembali, pada aplikasi web umumnya, ketika 
berhasil melakukan login, umumnya client akan di-**arah**-kan ke halaman lainnya 
bukan?

### res.redirect
Pengarahan halaman seperti aplikasi yang umumnya kita gunakan ini istilahnya 
adalah `redirect`. Dan pada express ini pun, kita bisa melakukan `redirect` tersebut
dengan `res.redirect`

Sekarang kita akan coba menambahkan pada aplikasi yang kita gunakan, untuk dapat 
melakukan redirect ketika user sudah melakukan input.

Mari kita ubah code `app.js` menjadi [Code 14](#code-14)

### Code 14
```javascript
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
  // Untuk keperluan debugging
  console.log(`Username: ${req.body['label-nama']}`);
  console.log(`Password: ${req.body['label-password']}`);
  
  // Di sini kita akan mengembalikan lagi ke halaman input username dan password.
  // dengan menggunakan res.redirect
  res.redirect('/user/get-form');
});

app.listen(PORT, () => {
  console.log(`Aplikasi berjalan pada port ${PORT}`);
});
```

Dapat dilihat bahwa pada `res.redirect` ini **TIDAK** dapat menerima data apapun,
berbeda dengan `res.render` ataupun `res.send`

Dari kode di atas, dapat dilihat apabila kita melakukan penambahan endpoint pada
aplikasi kita, maka file `app.js` ini akan bertambah semakin banyak, besar, dan
membingungkan bukan?

## Express Router
Dalam membuat aplikasi yang kita buat dengan cara di atas, semakin banyak alur endpoint dalam aplikasi kita, tentunya akan semakin besar juga file `app.js` 
yang kita miliki bukan?

Dalam express, ada sebuah cara untuk mengatasi hal tersebut, yaitu dengan 
memisah rute `routing` ke dalam file lainnya supaya lebih mudah dibaca.

Cara ini dikenal dengan istilah `Express Router`.

Untuk menggunakan ini, kita perlu membuat sebuah folder dengan nama `routes`
terlebih dahulu.

Kemudian kita akan memindahkan semua yang memiliki endpoint `/user` di depannya
ke dalam satu file tersendiri dengan nama `user-route.js`

Endpoint yang dipindahkan adalah:
* GET /user
* GET /user/get-form
* GET /user/get-form-handler
* POST /user/get-form-handler

Setelah itu kita juga akan memodifikasi code pada `user-route.js` sedikit sehingga
menjadi seperti [Code 15](#code-15)

### Code 15
```javascript
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
```

Kemudian setelah `user-route.js` sudah kita modifikasi, saatnya kita memodifikasi
`app.js` agar dapat menerima rute tambahan ini dengan `awalan` berupa `/user`.

Hasil modifikasi `app.js` dapat dilihat pada [Code 16](#code-16)

### Code 16
```javascript
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
```

Dari kode di atas, kita sudah berhasil untuk menggunakan express Router
dengan baik. 

Selamat !

## Reference
* [Express JS Documentation](https://expressjs.com/en/api.html#express)
* [Express Templating Engine - EJS How to](https://github.com/mde/ejs/wiki/Using-EJS-with-Express)
* [Express JS - Using Middleware](https://expressjs.com/en/guide/using-middleware.html)
* [Express JS - Router](https://expressjs.com/en/guide/routing.html)
* [EJS Documentation](https://ejs.co/#docs)
* [Nodemon - how to install](https://nodemon.io/)