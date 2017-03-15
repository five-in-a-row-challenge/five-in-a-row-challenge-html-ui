$(document).ready(function() {

    $('#connect')
        .click(function(e) {
            loadGames();
            loadPlayers();
            $('#urlc')
                .transition('fade up');
            $('.menu .item')
                .tab();
        })
        $.fn.api.settings.successTest = function(response) {
          console.log("successtest");
          if(response && response.success) {
            return response.success;
          }
          return true;
        };


});

function loadPlayers() {
    var playersUrl = document.getElementById('urlfield').value + '/api/players/';
    $.ajax({
        url: playersUrl,
        success: function(data) {
            for (var i in data) {
                $("<div>")
                    .addClass('item')
                    .text(data[i].userName).
                appendTo("#playerlist");
            }
            //$("<div>").addClass("some-wrapping-div")

            let addplayer = `<div class="some-wrapping-div">
                  <div class="ui custom button" id = "addplayerbutton">Add new player</div>
                </div>
                <div class="ui custom popup top left" id="addplayerform">
                  <form class="ui form">
              <div class="field">
                <label>Name</label>
                <input type="text" name="userName" placeholder="Player Name">
              </div>
              <div class="field">
                <label>Url</label>
                <input type="text" name="networkAddress" placeholder="url">
              </div>
              <button class="ui button" type="submit" id = "submitplayer">Submit</button>
            </form>
                </div>`;
            $("#playerlist").append(addplayer);
            $('#addplayerbutton')
                .popup({
                    popup: $('.custom.popup'),
                    on: 'click'
                });
                $('#submitplayer')
                .api({
                        method:"POST",
                        contentType: 'application/json',
                        url: document.getElementById('urlfield').value + '/api/players/',
                        on:"click",

                        beforeSend: function(settings) {
                          settings.data = JSON.stringify({
                            "networkAddress": $("input[name=networkAddress]").val(),
                            "userName": $("input[name=userName]").val()
                          })
                        return settings;
                      },
                      onSuccess: function(response) {
                        console.log("SUCCESS++++++++");
     // valid response and response.success = true
                      },
                      onResponse: function(response) {
      // make some adjustments to response
      console.log("onResponse");
      return response;
    },
                      successTest: function (response) {
                        console.log(response);
                        console.log("TEstitn")
            return  true ;
        },
                      onFailure: function(response) {
                        console.log("response");
     // valid response and response.success = true
                      }
                  }
                )

//     xhr.setRequestHeader ('Content-Type', 'application/json');
        }
    })
}

function loadGames() {
    var gamesUrl = document.getElementById('urlfield').value + '/api/games/';
    $.ajax({
        url: gamesUrl,
        success: function(data) {
            $("#gamelist").empty();
            for (var i in data) {
                var listDiv = $("<div>")
                    .addClass('item');
                $("<i>").addClass("play icon").on("click", {
                    id: data[i].id
                }, loadHistories).appendTo(listDiv);
                $("<i>").addClass("bar chart icon").on("click", {
                    id: data[i].id
                }, charting).appendTo(listDiv);
                var content = $("<div>").addClass("content");
                var description = $("<div>").addClass("description").text(data[i].createdDate + " (" + data[i].gameStatus + ")").appendTo(content);
                content.appendTo(listDiv);
                $("#gamelist").append(listDiv);
            }
            $("#gamelist").append("<button class=\"ui button urlc\" onclick=\"startGame()\">Start new game</button><br/>");
        }

    })

}

function loadHistories(event) {
    var id = event.data.id;
    var urlf = document.getElementById('urlfield').value;
    var urlpart = '/api/games/';
    $.ajax({
        url: urlf + urlpart + id + "/histories",
        success: function(data) {
            $("#historieslist").empty();
            for (var i in data) {
                var text = createHistoryLine(data[i]);
                var listDiv = $("<div>")
                    .addClass('item');
                $("<i>").addClass("play icon")
                    //.on("click", {id: data[i].id}, loadHistories)
                    .appendTo(listDiv);
                var content = $("<div>").addClass("content");
                var description = $("<div>").addClass("description").html(text).appendTo(content);
                content.appendTo(listDiv);
                $("#historieslist").append(listDiv);
            }
            $("#gamehistoryheader").empty();
            $("#gamehistoryheader").append("History of " + id + " game");
            $('#historymodal')
                .modal('show', true)
        }
    })

    function createHistoryLine(data) {
        var result = data.round + ". " + data.gameNumber + " \> ";
        if (data.winner == null) {
            result += data.firstPlayer.userName + " vs " + data.secondPlayer.userName;
        } else {
            if (data.winner.userName === data.firstPlayer.userName) {
                result += "<b>" + data.firstPlayer.userName + "</b> vs " + data.secondPlayer.userName;
            } else {
                result += data.firstPlayer.userName + " vs <b> " + data.secondPlayer.userName + "</b>";
            }
        }
        return result;
    }
    function createInputField(label, name, placeholder){
      let fieldDiv = $("<div>").addClass("field");
      fieldDiv.append($("<label>").text("Name"));
      fieldDiv.append($("<input>")).type("text").name("name").attr("placeholder", "Player Name");
      return fieldDiv;
    }



}
