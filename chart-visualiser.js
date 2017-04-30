function charting(event) {
    let id = event.data.id;
    let players = event.data.players;
    let urlf = document.getElementById('urlfield').value;
    let chartData = [];
    let legends = [];
    for (let i in players) {
        legends[i] = players[i];
        chartData[players[i]] = [];
        chartData[players[i]][0] = {meta:"", value:0};
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
      let lastRound = 0;
      let max = 0;
      for (let i in data) {
          if (lastRound != data[i].round) {
              lastRound = data[i].round;
              for (let j in chartData) {
                chartData[j][lastRound] = {value:chartData[j][lastRound - 1].value, meta:"" };
              }
          }
          if (data[i].winner === null) {
              chartData[data[i].firstPlayerId][lastRound].value += 2;
              chartData[data[i].secondPlayerId][lastRound].value += 2;

          } else {
              var winner = data[i].winner;
              chartData[winner][lastRound].value += 5;

          }
          if (chartData[data[i].firstPlayerId][lastRound].value > max ) {
              max = chartData[data[i].firstPlayerId][lastRound].value;
          }
          if(chartData[data[i].secondPlayerId][lastRound].value > max){
            max = chartData[data[i].secondPlayerId][lastRound].value;
          }
          chartData[data[i].firstPlayerId][lastRound].meta+=createHistoryLine(data[i])+"<br/>";
          chartData[data[i].secondPlayerId][lastRound].meta+=createHistoryLine(data[i])+"<br/>";
      }

      var chartDataPure = [];
      var aab = 0;
      for (var aaa in chartData) {
          chartDataPure[aab] = chartData[aaa];
          aab++;
      }
      let labels = [];
      for(let roundnum = 0; roundnum<=lastRound; roundnum++){
        labels.push(`Round ${roundnum}`);
      }
      new Chartist.Line('.ct-chart', {
          labels,
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
                  position: "top"
              }),
              Chartist.plugins.tooltip({  metaIsHTML:true})
          ]
      });

      $("#gamechartheader").empty();
      $("#gamechartheader").append("History of " + id + " game");
  }
