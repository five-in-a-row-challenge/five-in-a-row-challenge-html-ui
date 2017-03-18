function charting(event) {
    id = event.data.id;

    console.log(id);
    var urlpart = '/api/players/';
    var urlf = document.getElementById('urlfield').value;
    $.ajax({
        url: urlf + urlpart,
        method: 'GET',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data, textStatus, jqXHR) {
            makediagram(textStatus, data);
        }
    })
}


function makediagram(code, data) {
    var urlf = document.getElementById('urlfield').value;
    var chartData = [];
    var legends = [];
    for (var i in data) {
        legends[i] = data[i].userName;
        chartData[data[i].userName] = [];
        chartData[data[i].userName][0] = 0;
    }
    urlpart = '/api/games/';
    $.ajax({
        url: urlf + urlpart + id + "/histories",
        method: 'GET',
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data, textStatus, jqXHR) {
            loadGameHistory(textStatus, data, chartData, legends);
        }
  })
}
  function loadGameHistory(code, data, chartData, legends) {
      var lastRound = 0;
      var max = 0;
      console.log("DATAAAAAAAAAA");
      for (var i in data) {
        console.log(i);
        console.log(data[i]);
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
      console.log(chartDataPure);
      var modalx = $('#chartmodal')
          .modal('show', true);
      aasdasd = new Chartist.Line('.ct-chart', {
          labels: ['Round 0', 'Round 1', 'Round 2'],
          series: chartDataPure
      }, {
          fullWidth: false,
          height: "300px",
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
              })
          ]
      });

      $("#gamehistoryheader").empty();
      $("#gamehistoryheader").append("History of " + id + " game");
      console.log(chartData);
      $('#chartmodal').modal('refresh');
  }
