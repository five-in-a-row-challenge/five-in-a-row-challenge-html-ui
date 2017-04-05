function charting(event) {
    let id = event.data.id;
    let players = event.data.players;
    let urlf = document.getElementById('urlfield').value;
    let chartData = [];
    let legends = [];
    for (let i in players) {
        legends[i] = players[i];
        chartData[players[i]] = [];
        chartData[players[i]][0] = 0;
    }
    let urlpart = '/api/games/';
    $.ajax({
        url: urlf + urlpart + id + "/histories",
        method: 'GET',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data, textStatus, jqXHR) {
            loadGameHistory(textStatus, data, chartData, legends, id);
        }
  })

}

  function loadGameHistory(code, data, chartData, legends, id) {
      var lastRound = 0;
      var max = 0;
      for (var i in data) {
          if (lastRound != data[i].round) {
              lastRound = data[i].round;
              for (var j in chartData) {
                  chartData[j][lastRound] = chartData[j][lastRound - 1];
              }
          }
          if (data[i].winner === null) {
              chartData[data[i].firstPlayerId][lastRound] += 2;
              chartData[data[i].secondPlayerId][lastRound] += 2;
              if (chartData[data[i].firstPlayerId][lastRound] > max || chartData[data[i].secondPlayerId][lastRound] > max) {
                  max = chartData[data[i].firstPlayerId][lastRound] > chartData[data[i].secondPlayerId][lastRound] ? chartData[data[i].secondPlayerId][lastRound] : chartData[data[i].firstPlayerId][lastRound];
              }
          } else {
              var winner = data[i].winner;
              chartData[winner][lastRound] += 5;
              if (chartData[winner][lastRound] > max) {
                  max = chartData[winner][lastRound];
              }
          }
      }

      var chartDataPure = [];
      var aab = 0;
      for (var aaa in chartData) {
          chartDataPure[aab] = chartData[aaa];
          aab++;
      }

      new Chartist.Line('.ct-chart', {
          labels: ['Round 0', 'Round 1', 'Round 2'],
          series: chartDataPure
      }, {
          fullWidth: false,
          height: "500px",
          onlyInteger: true,
          low: 0,
          high: max + 10,
          chartPadding: {
              right: 40
          },
          plugins: [
              Chartist.plugins.legend({
                  stackBars: true,
                  legendNames: legends,
                  position: "bottom"
              }),
              Chartist.plugins.tooltip()
          ]
      });

      $("#gamechartheader").empty();
      $("#gamechartheader").append("History of " + id + " game");
      console.log(chartData);
  }
