const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let game = null;
let interval;

function startGame(type) {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("backBtn").style.display = "inline-block";

  if (type === "snake") startSnake();
  if (type === "pong") startPong();
  if (type === "cube") startCube();
}

function backToMenu() {
  clearInterval(interval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";
  document.getElementById("menu").style.display = "block";
  document.getElementById("backBtn").style.display = "none";
}


// змейка
function startSnake() {
  const box = 20;
  let snake = [{ x: 9 * box, y: 10 * box }];
  let direction;
  let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  });

  interval = setInterval(() => {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let s of snake) {
      ctx.fillStyle = "#00b894";
      ctx.fillRect(s.x, s.y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
      food = {
        x: Math.floor(Math.random() * 29 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
      };
    } else {
      snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // game over
    if (
      headX < 0 ||
      headX >= canvas.width ||
      headY < 0 ||
      headY >= canvas.height ||
      snake.some(s => s.x === headX && s.y === headY)
    ) {
      alert("Игра окончена!");
      backToMenu();
    }

    snake.unshift(newHead);
  }, 100);
}

// Пинг понг
function startPong() {
  let paddleWidth = 100,
    paddleHeight = 10,
    x = canvas.width / 2 - paddleWidth / 2,
    y = canvas.height - paddleHeight - 10,
    ballX = canvas.width / 2,
    ballY = canvas.height / 2,
    ballSpeedX = 4,
    ballSpeedY = 4,
    score = 0;

  document.addEventListener("mousemove", e => {
    let rect = canvas.getBoundingClientRect();
    x = e.clientX - rect.left - paddleWidth / 2;
  });

  interval = setInterval(() => {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00b894";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 || ballX > canvas.width) ballSpeedX = -ballSpeedX;
    if (ballY < 0) ballSpeedY = -ballSpeedY;

    if (
      ballY > y &&
      ballX > x &&
      ballX < x + paddleWidth &&
      ballY < y + paddleHeight
    ) {
      ballSpeedY = -ballSpeedY;
      score++;
    }

    if (ballY > canvas.height) {
      alert(`Игра окончена! Очков: ${score}`);
      backToMenu();
    }

    ctx.fillStyle = "white";
    ctx.fillText("Очки: " + score, 10, 20);
  }, 20);
}


// Поймай кубик
function startCube() {
  let cube = { x: 200, y: 150, size: 50 };
  let score = 0;

  function newCube() {
    cube.x = Math.random() * (canvas.width - cube.size);
    cube.y = Math.random() * (canvas.height - cube.size);
  }

  canvas.addEventListener("click", clickHandler);

  function clickHandler(e) {
    let rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    if (
      clickX >= cube.x &&
      clickX <= cube.x + cube.size &&
      clickY >= cube.y &&
      clickY <= cube.y + cube.size
    ) {
      score++;
      newCube();
    }
  }

  newCube();

  interval = setInterval(() => {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0984e3";
    ctx.fillRect(cube.x, cube.y, cube.size, cube.size);

    ctx.fillStyle = "white";
    ctx.fillText("Очки: " + score, 10, 20);
  }, 30);
}
