/** @type {HTMLCanvasElement} */
const gameBoard = document.querySelector("#game-board");
/** @type {HTMLDivElement} */
const scoreText = document.querySelector(".score-text");

const ctx = gameBoard.getContext("2d"),
  gameWidth = gameBoard.width,
  gameHeight = gameBoard.height,
  boardBackground = "white",
  snakeColor = "green",
  snakeBorder = "black",
  foodColor = "red",
  unitSize = 25;

let running = false,
  xVelocity = unitSize,
  yVelocity = 0,
  foodX,
  foodY,
  score = 0,
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

window.addEventListener("keydown", changeDirection);

gameStart();

function gameStart() {
  running = true;

  scoreText.textContent = score;

  createFood();

  loop();
}

function loop() {
  if (running) {
    setTimeout(() => {
      update();
      draw();
      checkGameOver();

      loop();
    }, 100);
  } else {
    displayGameOver();
  }
}

function draw() {
  clearBoard();
  drawFood();
  drawSnake();
}

function update() {
  updateSnake();
}

function createFood() {
  function randomNumber(min, max) {
    return (
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
    );
  }

  foodX = randomNumber(0, gameWidth - unitSize);
  foodY = randomNumber(0, gameWidth - unitSize);
}

function updateSnake() {
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };

  snake.unshift(head);

  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;

    scoreText.textContent = score;

    createFood();
  } else {
    snake.pop();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  ctx.fillStyle = "#000000";
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
  ctx.fillStyle = "#000000";
}

function drawSnake() {
  ctx.fillStyle = snakeColor;

  ctx.strokeStyle = snakeBorder;

  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);

    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;

  const LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    SPACE = 32;

  const goingUp = yVelocity == -unitSize,
    goingDown = yVelocity == unitSize,
    goingRight = xVelocity == unitSize,
    goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;

    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;

    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;

    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;

    case keyPressed == SPACE && running === false:
      resetGame();
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;

    case snake[0].x >= gameWidth:
      running = false;
      break;

    case snake[0].y < 0:
      running = false;
      break;

    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  ctx.font = "50px Open Sans";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  ctx.font = "24px Open Sans";
  ctx.fillText("Press space to restart", gameWidth / 2, gameHeight / 2 + 50);

  running = false;
}

function resetGame() {
  score = 0;

  xVelocity = unitSize;

  yVelocity = 0;

  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

  gameStart();
}
