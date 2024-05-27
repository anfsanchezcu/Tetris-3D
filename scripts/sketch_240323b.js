let board;
let token;
let speed;
let intervalId;
let board_hight;

function setup() {
  const canvas = createCanvas(500, 400, WEBGL);
  canvas.parent("canvas-container");
  canvas.addClass("");
  speed = 500;
  let board_width = 7;
  let board_deep = 7;
  board_hight = 10;
  board = new Board(board_width, board_deep, board_hight); //width, deep, hight
  token = new Shape(board.getDimentions(), board.getScale());
  setupGame();
  setImageToInmersive();
}

function draw() {
  background(0);
  orbitControl();
  scale(0.5, -0.5, 0.5);
  token.draw();
  board.draw();
  getImageToInmersive();
}

function drawAxes() {
  push();
  translate(-width / 1.1, -height / 2, 0); //ajuste para render al "centro"
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
  intervalId = setInterval(() => {
    if (token.shape == undefined) token.generateRamdonShape();
    else startGame();
  }, speed);
}

//es await por que el checkpoint al eliminar una fila lo hace con un efecto bonito :3
async function startGame() {
  const tokenPosition = token.getPosition();
  let nextPosition = {
    x: tokenPosition.x,
    y: tokenPosition.y - 1,
    z: tokenPosition.z,
  };
  let auxResult = board.checkCollision(token.shape, nextPosition);
  if (auxResult) token.moveDown();
  else {
    if (isColumnFull()) {
      endGame();
    } else {
      console.log("stop moving")
      board.saveState(token.shape, tokenPosition);
      addPoints(100);
      token.reset();
      let pointByLine = await board.checkPoints();
      addPoints(pointByLine);
      addCompletedLines(pointByLine / 1000);
    }
  }
}

function keyPressed() {
  /* ----------------------move arounde the table------------------------- */
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
  if (key === " ") {
    speed -= 150;
    timeController(speed);
  }

  /* ----------------------move over it self------------------------- */

  if (key === "a") {
    aux_shape = token.rotateY("left");
    if (board.checkCollision(aux_shape, token.getPosition()))
      token.shape = aux_shape;
    aux_shape = null;
  }
  if (key === "d") {
    aux_shape = token.rotateY("right");
    if (board.checkCollision(aux_shape, token.getPosition())) 
      token.shape = aux_shape;
    
    aux_shape = null;
  }

  if (key === "w" ) {
    aux_shape = token.rotateX("up");
    if (board.checkCollision(aux_shape, token.getPosition()))
      token.shape = aux_shape;
    aux_shape = null;
  }
  if ( key === "s") {
    aux_shape = token.rotateX("down");
    if (board.checkCollision(aux_shape, token.getPosition()))
      token.shape = aux_shape;
    aux_shape = null;
  }
  if ( key === "z") {
    aux_shape = token.rotateZ("down");
    if (board.checkCollision(aux_shape, token.getPosition()))
      token.shape = aux_shape;
    aux_shape = null;
  }
}

function keyReleased() {
  if (key === " ") {
    speed -= 50;
    timeController(speed);
  }
}

function addPoints(points) {
  let scoreElement = document.getElementById("score");
  scoreElement.textContent = ` ${int(scoreElement.textContent) + points}`;
}
function addCompletedLines(completeLines) {
  let lineElement = document.getElementById("lines");
  lineElement.textContent = ` ${int(lineElement.textContent) + completeLines}`;
}
function isColumnFull() {
  const tokenPosition = token.getPosition();
  let nextPosition = {
    x: tokenPosition.x,
    y: board_hight,
    z: tokenPosition.z,
  };
  return !board.checkCollision(token.shape, nextPosition);
}
function endGame() {
  let modal = document.getElementById("myModalGameOver");
  modal.classList.remove("hidden");
  clearInterval(intervalId);
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function timeController(time) {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (token.shape == undefined) token.generateRamdonShape();
    else startGame();
  }, time);
}

function getImageToInmersive() {
  imageUrl = canvas.toDataURL("image/png");
}
function setImageToInmersive() {
  setInterval(function () {
    let imgElement = document.getElementById("container");
    imgElement.style.backgroundImage = `url("${imageUrl}")`;
  }, 1);
}
