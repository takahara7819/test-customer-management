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

app.get("/", (req, res) => {
  //テーブル全体を取得
  const sql = "SELECT * FROM appointments";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    // 目標金額の合計値を取得するSQLクエリ
    const goalQuery = "SELECT SUM(salesGoal) AS totalGoal FROM appointments";
    con.query(goalQuery, function (err, goalResult, fields) {
      if (err) throw err;

      // 売上金額の合計値を取得するSQLクエリ
      const salesQuery = "SELECT SUM(sales) AS totalSales FROM appointments";
      con.query(salesQuery, function (err, salesResult, fields) {
        if (err) throw err;
        const totalGoal = goalResult[0].totalGoal;
        const totalSales = salesResult[0].totalSales;

        //グラフ用のクエリ
        const graphQuery =
          "SELECT CompanyName, SUM(sales) AS totalSales, SUM(CurrentContractCount) AS totalContracts FROM appointments GROUP BY CompanyName";
        con.query(graphQuery, function (err, graphResult, fields) {
          if (err) throw err;

          res.render("index", {
            users: result,
            Goal: totalGoal,
            Sales: totalSales,
            Chert: graphResult,
          });
        });
      });
    });
  });
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO appointments SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
  });
});

//ページ遷移
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/form.html"));
});

//詳細情報ページ取得
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

//詳細情報ページ 商談履歴追加
app.post("/taskup/:id", (req, res) => {
  const sql = "INSERT INTO works SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/edit/" + req.params.id);
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
