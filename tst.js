app.get("/", (req, res) => {
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    con.query(goalQuery, function (err, goalResult, fields) {
      if (err) throw err;
      con.query(salesQuery, function (err, salesResult, fields) {
        if (err) throw err;
        const totalGoal = goalResult[0].totalGoal;
        const totalSales = salesResult[0].totalSales;

        // グラフ用のクエリ
        const graphQuery = "SELECT CompanyName, SUM(sales) AS totalSales, SUM(CurrentContractCount) AS totalContracts FROM appointments GROUP BY CompanyName";
        con.query(graphQuery, function (err, graphResult, fields) {
          if (err) throw err;
          console.log(graphResult); // 結果をログに出力

          res.render("index", {
            Goal: totalGoal,
            Sales: totalSales,
            users: result,
            Chert: JSON.stringify(graphResult) // グラフ用のデータをテンプレートに渡す
          });
        });
      });
    });
  });
});
