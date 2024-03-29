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

  //ページ遷移に変更予定
  // app.get("/create", (req, res) => {
  //   res.sendFile(path.join(__dirname, "html/form.html"));
  // });

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      users: result,
      //app.jsで宣言した変数をindex.ejsのscriptタグ内で使用する
    });
  });
});

//ページ遷移
const route = (event) => {
  // クリック時のイベントを取得
  event = event || window.event; //なにこれ
  //論理演算子？右と左どっちかを返す？
  //「window.event」で現在サイトのコードが処理しているeventを返す。意図しないものになる場合もあるから注意。

  // ブラウザのデフォルト動作をキャンセル
  event.preventDefault();
  // ブラウザの履歴に追加
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  404: "html/404.html",
  "/create": "form.html",
};

const handleLocation = async () => {
  // 現在のパスを取得

  if (typeof window !== "undefined") {
    const path = window.location.pathname;
  }

  // 現在のパスに紐ずくhtmlのパスを取得
  const route = routes[path] || routes[404];
  // htmlを取得
  const html = await fetch(route).then((data) => data.text());
  // 取得したhtmlを動的にルート直下のindex.htmlに差し込む
  document.getElementById("main-page").innerHTML = html;
};

if (typeof window !== "undefined") {
  // windowを使う処理を記述
  window.addEventListener("popstate", (event) => {
    handleLocation();
  });
}

handleLocation();

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
