
function initTable(data) {
  ctx = c.getContext("2d");
  size = Math.sqrt(data.steps[0].board.length);
  c.width = size * 20;
  c.height = size * 20;
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  for (var i = 0; i <= size; i++) {
    ctx.moveTo(0, (i * 20));
    ctx.lineTo(size * 20, (i * 20));
    ctx.moveTo((i * 20), 0);
    ctx.lineTo((i * 20), size * 20);
  }
  if(gameTable.length===0){
    for (i = 0; i < size; i++) {

      var rowxsdsf = [];
      for (var j = 0; j < size; j++) {
        rowxsdsf[j] = ' ';
      }
      gameTable[i] = rowxsdsf;
    }
  }

  ctx.strokeStyle = '#555555';
  ctx.stroke();
  previousStep = "NNNNNNNNNNNNNNNNNNNNNNNNN";
  console.log(data.steps);
  playGame(data, 0);
}

function playGame(gameData, i ){
  if(i>=25) return;
  console.log("step "+ gameData.steps[i].numberOfStep);
  //  let actualMove = -1;
  console.log(previousStep);
  console.log(gameData.steps[i].board);
  for(let as = 0; as< 25;as++){
    if(previousStep[as]!==gameData.steps[i].board[as]){
      console.log(gameData.steps[i].board[as]);
      let actualMove = as;
      previousStep = gameData.steps[i].board;
      console.log(previousStep);
      step(Math.floor(actualMove/5),actualMove%5);
      break;
    }
  }
}

function step(row,col){
  console.log("stepping "  + row + " " + col);
  if (gameTable[row][col] === ' ') {
    if(player ==='x') {
      gameTable[row][col] = "x";
      drawXAnimated(row, col);
    } else {
      gameTable[row][col] = "o";
      drawOAnimated(row, col);
    }
    changePlayer();
  }
}

function changePlayer() {
  if (player === 'x') {
    player = 'o';
  } else {
    player = 'x';
  }
}

function checkWin(row, col, x, y) {
  var playerSign = gameTable[row][col];
  var firstresult = 0;
  var secondresult = 0;
  for (i = 0; i < 5; ++i) {
    if (checkCell(row - x * i, col - y * i, playerSign)) {
      firstresult++;
    } else {
      break;
    }
  }

  for (i = 1; i < 5; ++i) {
    if (checkCell(row + x * i, col + y * i, playerSign)) {
      secondresult++;
    } else {
      break;
    }
  }

  if (firstresult + secondresult > 4) {
    var ax = (row - x * (firstresult - 1)) * 20 + 10;
    var ay = (col - y * (firstresult - 1)) * 20 + 10;
    var bx = (row + (x) * secondresult) * 20 + 10;
    var by = (col + (y) * secondresult) * 20 + 10;
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    return true;
  }
  return false;
}
//var ctx = document.querySelector("canvas").getContext("2d");

function drawXAnimated(row, col, way, percent) {
  if (percent === undefined) {
    clearCell(row, col);
    percent = 1;
  } else {
    percent += 10;
  }
  if (way === undefined) {
    way = 1;
  }
  var actPercent = percent / 100;
  clearCell(row,col);
  ctx.beginPath();
  ctx.lineWidth = 2.2;
  if (way === 1) {
    ctx.moveTo(row * 20 + offset, col * 20 + offset);
    ctx.lineTo(row * 20 + offset + actPercent * (20 - 2 * offset), col * 20 + offset  +actPercent * (20 - 2 * offset));
  } else {
    ctx.moveTo(row * 20 + offset, col * 20 + offset);
    ctx.lineTo((row + 1) * 20 - offset, (col + 1) * 20 - offset);
    ctx.moveTo((row) * 20 + offset, (col + 1) * 20 - offset);
    ctx.lineTo((row) * 20 + offset + actPercent * (20 - 2 * offset), (col + 1) * 20 - offset - actPercent * (20 - 2 * offset));
  }
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();
  if (percent < 100) {
    window.requestAnimationFrame(function () {
      drawXAnimated(row, col, way, percent);
    });
  } else if (percent >= 100 && way === 1) {
    way++;
    percent = 1;
    window.requestAnimationFrame(function () {
      drawXAnimated(row, col, way, percent);
    });
  } else {
    if (checkWin(row, col, 1, 0) || checkWin(row, col, 1, 1) || checkWin(row, col, 0, 1) || checkWin(row, col, 1, -1)) {
    } else {
      // computerPlay(row, col);
      round++;
      setTimeout(function(){
        playGame(data, round)
      }, 250);
      ctx.restore();
    }
  }
}

function drawOAnimated(row, col, percent) {
  if (percent === undefined) {
    percent = 1;
  } else {
    percent += 10;
  }
  var actPercent = percent / 100;
  ctx.clearRect(row * 20 + 1, col * 20 + 1, 18, 18);
  ctx.beginPath();
  ctx.lineWidth = 2.4;
  //ctx.arc(row * 20 + 10, col * 20 + 10, 20/2-offset, 0, 2*Math.PI);
  ctx.arc(row * 20 + 10, col * 20 + 10, 20 / 2 - offset, 0, actPercent * 2 * Math.PI);
  ctx.strokeStyle = '#0000ff';
  ctx.stroke();
  if (percent < 100) {
    window.requestAnimationFrame(function () {
      drawOAnimated(row, col, percent);
    });
  } else {
    if (checkWin(row, col, 1, 0) || checkWin(row, col, 1, 1) || checkWin(row, col, 0, 1) || checkWin(row, col, 1, -1)) {
    } ;
    round++;
    setTimeout(function(){
      playGame(data, round)
    }, 250);
  }
}

function clearCell(row, col) {
  ctx.strokeStyle = '#FF3399';
  ctx.clearRect(row * 20 + 1, col * 20 + 1, 18, 18);
}

function checkCell(actRow, actCol, playerSign) {
  return actRow >= 0 && actCol >= 0 && actRow < size && actCol < size && gameTable[actRow][actCol] === playerSign;
}
