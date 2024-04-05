let board;
let token;
let speed;
function setup() {
  const canvas = createCanvas(500, 400, WEBGL);
  canvas.parent("canvas-container");
  canvas.addClass("");
  speed = 500;
  board = new Board(7, 7, 10); //width, deep, hight
  token = new Shape(board.getDimentions(), board.getScale());
  setupGame();

  setTimeout(()=> board.drawTestFloor(4),2000)
  setTimeout(()=> board.drawTestFloor(1),7000)
  setTimeout(()=> board.drawTestFloor(5),5000)
}

function draw() {
  background(0);
  orbitControl();

  scale(0.5, -0.5, 0.5);
  //drawAxes();
  token.draw();
  board.draw();
}

function drawAxes() {
  push();
  translate(-width/1.1 , -height /2, 0 ); //ajuste para render al "centro"
  strokeWeight(4);
  stroke(255, 0, 0);
  line(0, 0, 100, 0);

  stroke(0, 255, 0);
  line(0, 0, 0, 100);

  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 100);
  pop();
}
function setupGame() {
  setInterval(() => {
    if (token.shape == undefined) token.generateRamdonShape();
    else startGame();
  }, speed);
}
async function startGame() {
  
  const tokenPosition = token.getPosition();
  let nextPosition = {
    x: tokenPosition.x,
    y: tokenPosition.y - 1,
    z: tokenPosition.z,
  };
  let auxResult = board.checkCollision(token.shape, nextPosition);
  if (auxResult == true) token.moveDown();
  else if (auxResult == false) {
    board.saveState(token.shape, tokenPosition);
    addPoints(100);
    token.reset();
    let pointByLine = await board.checkPoints();
    addPoints(pointByLine);
    addCompletedLines(pointByLine/1000);
  } else {
    console.log("ERROR: ", auxResult);
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    const tokenPosition = token.getPosition();
    let nextPosition = {
      x: tokenPosition.x + 1,
      y: tokenPosition.y,
      z: tokenPosition.z,
    };

    if (board.checkCollision(token.shape, nextPosition)) token.moveRight();
  }
  if (keyCode === LEFT_ARROW) {
    const tokenPosition = token.getPosition();
    let nextPosition = {
      x: tokenPosition.x - 1,
      y: tokenPosition.y,
      z: tokenPosition.z,
    };

    if (board.checkCollision(token.shape, nextPosition)) token.moveLeft();
  }
  if (keyCode === UP_ARROW) {
    const tokenPosition = token.getPosition();
    let nextPosition = {
      x: tokenPosition.x,
      y: tokenPosition.y,
      z: tokenPosition.z - 1,
    };

    if (board.checkCollision(token.shape, nextPosition)) token.moveBack();
  }
  if (keyCode === DOWN_ARROW) {
    const tokenPosition = token.getPosition();
    let nextPosition = {
      x: tokenPosition.x,
      y: tokenPosition.y,
      z: tokenPosition.z + 1,
    };

    if (board.checkCollision(token.shape, nextPosition)) token.moveFront();
  }
}

function addPoints(points){
  let scoreElement = document.getElementById('score');
  scoreElement.textContent = ` ${int(scoreElement.textContent)+ points}`;
}
function addCompletedLines(completeLines){
  let lineElement = document.getElementById('lines');
  lineElement.textContent = ` ${int(lineElement.textContent)+ completeLines}`;
}
