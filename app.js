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

// mysqlからデータを持ってくる joinで別テーブルと結合
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

  //ページ遷移
  app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "./html/form.html"));
  });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
      //app.jsで宣言した変数をindex.ejsのscriptタグ内で使用する
    });
  });
});

//詳細情報ページ取得 appointmentsテーブルにworksテーブルを結合
app.get("/edit/:id", (req, res) => {
  const sql =
    "SELECT * FROM appointments JOIN works ON appointments.id = works.id WHERE appointments.id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      user: result,
    });
  });
});
//TODOリスト 商談履歴追加
app.post("/taskup/:id", (req, res) => {
  const sql = "INSERT INTO works SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
//TODOリスト 更新用
app.post("/taskcheck/:id", (req, res) => {
  const sql = "UPDATE works SET ? WHERE task = " + req.params.task;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

//編集ページ取得・送信
app.get("/custom/:id", (req, res) => {
  const sql = "SELECT * FROM appointments WHERE id = ? ";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("custom", {
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

//間違えてDB削除しちゃうからいったんコメントアウト
// app.get("/delete/:id", (req, res) => {
//   const sql = "DELETE FROM appointments WHERE id = ?";
//   con.query(sql, [req.params.id], function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//     res.redirect("/");
//   });
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
