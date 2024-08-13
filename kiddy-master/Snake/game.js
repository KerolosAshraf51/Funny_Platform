const SNAKE_SPEED = 7;
const gridSize = 21;
const expansionRate = 1;
let lastRenderTime = 0;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
let snakeBody = [{ x: 11, y: 11 }];
let newSegments = 0;
let food = getRandomFoodPosition();

const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const playAgainButton = document.getElementById('play-again');
const highScoreMessageElement = document.getElementById('high-score-message');
const newHighScoreElement = document.getElementById('new-high-score');
const eatSound = document.getElementById('eat-sound');

highScoreElement.textContent = `High Score: ${highScore}`;

function main(currentTime) {
    if (gameOver) {
        playAgainButton.style.display = 'block';
        gameBoard.classList.add('blur');
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = `High Score: ${highScore}`;
            newHighScoreElement.textContent = highScore;
            highScoreMessageElement.style.display = 'block';
        }
        return;
    }
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

    lastRenderTime = currentTime;

    update();
    draw();
}

window.requestAnimationFrame(main);

function update() {
    updateSnake();
    updateFood();
    checkDeath();
    updateScore();
}

function draw() {
    gameBoard.innerHTML = "";
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateSnake() {
    addSegments();
    const inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }
    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function drawSnake(gameBoard) {
    snakeBody.forEach((segment) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.classList.add("snake");
        gameBoard.appendChild(snakeElement);
    });
}

function expandSnake(amount) {
    newSegments += amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false;
        return equalPositions(segment, position);
    });
}

function getSnakeHead() {
    return snakeBody[0];
}

function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    newSegments = 0;
}

function updateFood() {
    if (onSnake(food)) {
        expandSnake(expansionRate);
        food = getRandomFoodPosition();
        score += 1;
        eatSound.play(); // Play sound when snake eats food
    }
}

function drawFood(gameBoard) {
    const foodElement = document.createElement("div");
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1
    };
}

function outsideGrid(position) {
    return (
        position.x < 1 ||
        position.x > gridSize ||
        position.y < 1 ||
        position.y > gridSize
    );
}

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (lastInputDirection.y !== 0) break;
            inputDirection = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (lastInputDirection.x !== 0) break;
            inputDirection = { x: 1, y: 0 };
            break;
    }
});

function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection;
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

playAgainButton.addEventListener('click', () => {
    gameOver = false;
    score = 0;
    inputDirection = { x: 0, y: 0 };
    lastInputDirection = { x: 0, y: 0 };
    snakeBody.length = 0;
    snakeBody.push({ x: 11, y: 11 });
    newSegments = 0;
    food = getRandomFoodPosition();
    playAgainButton.style.display = 'none';
    highScoreMessageElement.style.display = 'none';
    gameBoard.classList.remove('blur');
    window.requestAnimationFrame(main);
});
