datasets: [
  {
      label: '月別気温(2019)',
      data: [3.7, 5.3, 8.4, 12.0, 19.3, 22.0, 25.7, 28.2, 24.8, 18.5, 11.5, 7.5],
      datalabels: { // 月別気温(2019)のデータラベル設定
          color: 'rgba(200,60,60,1)',
          font: {
              weight: 'bold'
          },
          anchor: 'end', // データラベルの位置（'end' は上端）
          align: 'end', // データラベルの位置（'end' は上側）
          padding: {
              bottom: 60
          },
          formatter: function (value, context) {
              return value + '℃'; // データラベルに文字などを付け足す
          },
      }
  },
  {
      label: '月別気温(1919)',
      data: [1.4, 2.9, 7.2, 12.4, 16.9, 21.0, 24.5, 25.5, 21.4, 16.2, 10.8, 4.7],
      datalabels: { // 月別気温(1919)のデータラベル設定
          color: 'rgba(60,160,60,1)',
          anchor: 'start', // データラベルの位置（'start' は下端）
          align: 'start', // データラベルの位置（'start' は下側）
          padding: {
              top: 10
          }
      }
  }
]
