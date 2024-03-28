const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "user_db",
});

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
  const sql = "select * from appointments";
  app.post("/", (req, res) => {
    const sql = "INSERT INTO appointments SET ?";
    con.query(sql, req.body, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  });

  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "html/form.html"));
  });
  // ==========ここまでの範囲で書くようにしましょう。==========
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
      // ⓵ こちらはapp.jsで宣言した変数をindex.ejsのscriptタグ内で使用するために登録する場所になっています。
    });
  });
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM appointments WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});

app.post("/update/:id", (req, res) => {
  const sql = "UPDATE appointments SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

// app.get("/delete/:id", (req, res) => {
//   const sql = "DELETE FROM appointments WHERE id = ?";
//   con.query(sql, [req.params.id], function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//     res.redirect("/");
//   });
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
