$(document).ready(function() {

    $('#connect')
        .click(function(e) {
            loadGames();
            loadPlayersToDiv();
            $('#urlc')
                .transition('fade up');
            $('.menu .item')
                .tab();
        })
});

function loadPlayersToDiv() {
    var playersUrl = document.getElementById('urlfield').value + '/api/players/';
    $("#playerlist").empty();
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
              <button class="ui button" type="button" id = "submitplayer" onclick = "createPlayer()">Submit</button>
            </form>
                </div>`;
            $("#playerlist").append(addplayer);
            $('#addplayerbutton')
                .popup({
                    popup: $('#addplayerform'),
                    on: 'click'
                });


        }
    })
}

function createPlayer(){
  let playerdata = JSON.stringify({
      "networkAddress": $("input[name=networkAddress]").val(),
      "userName": $("input[name=userName]").val()
    });
  $.ajax({
          method:"POST",
          contentType: 'application/json',
          url: document.getElementById('urlfield').value + '/api/players/',
          data: playerdata,
          success: function(response) {
            $('#addplayerbutton').popup('hide');
            loadPlayersToDiv();
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
//                $("<i>").addClass("play icon").on("click", {
//                    id: data[i].id
//                }, loadHistories).appendTo(listDiv);
                if(data[i].gameStatus==='CREATED'){
                  $("<i>").addClass("link save icon startgameicon").on("click", {
                      id: data[i].id
                  }, startFromList).appendTo(listDiv);
                } else {
                  $("<i>").addClass("link bar chart icon").on("click", {
                      id: data[i].id,
                      players: data[i].players
                  }, charting).appendTo(listDiv);
                }
                var content = $("<div>").addClass("content");
                var description = $("<div>").addClass("description").text(data[i].createdDate + " (" + data[i].gameStatus + ")").appendTo(content);
                content.appendTo(listDiv);
                $("#gamelist").append(listDiv);
            }

            $("#gamelist").append("<button class=\"ui button urlc\" onclick=\"createGameWithAllPlayers()\">Start new game with all players</button><br/>");
            $("#gamelist").append("<button class=\"ui button urlc\" id=\"createGWAP\" onclick=\"createGame()\">Start new game</button><br/>");
            $("#gamelist").append(`
            <div class="ui custom popup top left" id="forpopup"> <span id = "createdGameId"></span>
              <form class="ui form" id = "playerlisttochoose">

              </form>
              <button class="ui button" type="button" id = "staaaaaaart" onclick = "startWithPlayers()">Submit</button>
              <button class="ui negative button" type="button" id = "staaaaaaart" onclick = "deleteGame()">Delete</button>
              <button class="ui button" type="button" id = "staaaaaaart" onclick = "cancelGamePopup()">Cancel</button>
            </div>
            `);
            $("#createGWAP").popup({popup : $("#forpopup"), on: "click"});
            $(".startgameicon").popup({popup : $("#forpopup"), on: "click"});
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
}
    function createHistoryLine(data) {
        var result = data.round + ". " + data.gameNumber + " \> ";
        if (data.winner == null) {
            result += data.firstPlayerId + " vs " + data.secondPlayerId;
        } else {
            if (data.winner === data.firstPlayerId) {
                result += "<b>" + data.firstPlayerId + "</b> vs " + data.secondPlayerId;
            } else {
                result += data.firstPlayerId + " vs <b> " + data.secondPlayerId + "</b>";
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



    function createGameWithAllPlayers(){
        var urlf = document.getElementById('urlfield').value;
        var urlpart ='/api/games/';

        $.ajax({
            url:urlf+urlpart,
            method:'POST',
            success: function(data) {
                loadPlayers(data.id, addPlayers);
        }
      });
    }

    function addPlayers(id, data){
        var urlf = document.getElementById('urlfield').value;
        var urlpart =`/api/games/${id}/players`;
        let allplayers = Array.from(data, (a)=>"\""+a.userName+"\"")
        let allplayersString = "["+allplayers.join(",")+"]";
        $.ajax({
            url:urlf+urlpart,
            method:'POST',
            data: allplayersString,
            contentType:"application/json; charset=utf-8",
            success: function(data) {
              startGame(id);
        }
      });
    }

    function loadPlayers(id, func) {
        var playersUrl = document.getElementById('urlfield').value + '/api/players/';
        $.ajax({
            url: playersUrl,
            success: function(data) {
              func(id, data);
            }
          })
        }

    function startGame(gameId){
      var urlf = document.getElementById('urlfield').value;
        var urlpart =`/api/games/${gameId}/start`;
        $.ajax({
            url:urlf+urlpart,
            method:'POST',
            success: function(data) {
              loadGames();
        }
      });
    }

    function createGame(){
      var urlf = document.getElementById('urlfield').value;
      var urlpart ='/api/games/';

      $.ajax({
          url:urlf+urlpart,
          method:'POST',
          success: function(data) {
              loadPlayers(data.id, loadplayerstopopup);
          }
      });

    }

    function loadplayerstopopup(id, data){
      $("#playerlisttochoose").empty();
      $("#createdGameId").text(id);
      for(let player of data) {
        let checkbox =`  <div class="ui checkbox">
            <input type="checkbox" name="${player.userName}" class = "user">
            <label>${player.userName}</label>
          </div>`;
          $("#playerlisttochoose").append(checkbox);
      }
    }

    function startFromList(event){
      loadPlayers(event.data.id, loadplayerstopopup);
    }

    function startWithPlayers(){
      let players = [];
      for (let a of $('.user:checkbox:checked')){
        let act =  {userName:a.name};
        players.push(act);
      }
      addPlayers($("#createdGameId").text(), players);
    }

    function deleteGame(){
      console.log($("#createdGameId").text() + " game is not deleted...");
    }

    function cancelGamePopup(){
      $(".startgameicon").popup('hide');
      loadGames();
    }
