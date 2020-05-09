## Table of Content
1. [Recap express](#recap-express)
1. [How to use nodemon](#how-to-use-nodemon)
1. [Template Engine - EJS](#template-engine---ejs)
    * HTML + EJS
    * res.render
    * Form
1. [Handling Route Post](#handling-route-post)
    * req.body
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

Dalam express sendiri, semua file `tampilan` dalam hal ini adalah file `ejs`nya
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
    misalkan datanya nanti kita taruh di ejs nya dalam sebuah 
    penampung yang namanya `dataUser`
  -->

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

### Form

## Handling Route Post

### req.body

### res.redirect

## Express Router

## Reference
* [Express JS Documentation](https://expressjs.com/en/api.html#express)
* [Express Templating Engine - EJS How to](https://github.com/mde/ejs/wiki/Using-EJS-with-Express)
* [EJS Documentation](https://ejs.co/#docs)
* [Nodemon - how to install](https://nodemon.io/)