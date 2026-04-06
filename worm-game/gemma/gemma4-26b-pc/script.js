const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const highScoreListEl = document.getElementById('high-score-list');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMsg = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');

// Game Constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game State
let snake = [];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('wormHighScore') || 0;
let gameLoopInterval = null;
let isPaused = true;

// Initialize High Score UI
highScoreEl.innerText = highScore;
updateHighScoreList();

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
startBtn.addEventListener('click', startGame);

function handleKeyPress(e) {
    if (isPaused && (e.code === 'Space' || e.code === 'Enter')) {
        startGame();
        return;
    }

    const key = e.key;
    // Prevent reversing direction
    if ((key === 'ArrowUp' || key === 'w') && dy !== 1) { dx = 0; dy = -1; window.playMoveSound(); }
    if ((key === 'ArrowDown' || key === 's') && dy !== -1) { dx = 0; dy = 1; window.playMoveSound(); }
    if ((key === 'ArrowLeft' || key === 'a') && dx !== 1) { dx = -1; dy = 0; window.playMoveSound(); }
    if ((key === 'ArrowRight' || key === 'd') && dx !== -1) { dx = 1; dy = 0; window.playMoveSound(); }
}

function startGame() {
    // Reset state
    snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dx = 0;
    dy = -1;
    score = 0;
    scoreEl.innerText = score;
    isPaused = false;
    overlay.style.display = 'none';

    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameUpdate, 100);
}

function gameUpdate() {
    moveSnake();
    if (checkGameOver()) return;
    checkFoodCollision();
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap-around Logic
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    snake.unshift(head);
    // Remove tail unless food eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        window.playEatSound();
        generateFood();
    } else {
        snake.pop();
    }
}

function checkFoodCollision() {
    // Handled in moveSnake for growth
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function checkGameOver() {
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            handleGameOver();
            return true;
        }
    }
    return false;
}

function handleGameOver() {
    isPaused = true;
    clearInterval(gameLoopInterval);
    window.playGameOverSound();

    overlayTitle.innerText = "GAME OVER";
    overlayMsg.innerText = `Final Score: ${score}`;
    overlay.style.display = 'flex';
    startBtn.innerText = "RETRY";

    saveScore(score);
}

function saveScore(newScore) {
    if (newint(newScore) > parseInt(highScore)) {
        highScore = newScore;
        localStorage.setItem('wormHighScore', highScore);
        highScoreEl.innerText = highScore;
    }

    // Top 5 Persistence
    let history = JSON.parse(localStorage.getItem('wormHistory')) || [];
    const entry = {
        score: newScore,
        date: new Date().toLocaleString()
    };
    history.push(entry);
    // Sort by score descending, then date descending
    history.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
    history = history.slice(0, 5);
    localStorage.setItem('wormHistory', JSON.stringify(history));

    updateHighScoreList();
}

function updateHighScoreList() {
    const history = JSON.parse(localStorage.getItem('wormHistory')) || [];
    highScoreListEl.innerHTML = history
        .map(item => `<li>${item.score} - <small>${item.date}</small></li>`)
        .join('');
}

function draw() {
    // Clear Canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food
    ctx.fillStyle = '#f0f'; // Neon Pink
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f0f';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#0ff' : '#0f0'; // Head is Cyan, Body is Green
        ctx.shadowBlur = index === 0 ? 15 : 5;
        ctx.shadowColor = index === 0 ? '#0ff' : '#0f0';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Reset shadow so it doesn't affect other UI elements or next frames
    ctx.shadowBlur = 0;
}

// Helper to prevent errors in logic
function newint(v) { return parseInt(v); }