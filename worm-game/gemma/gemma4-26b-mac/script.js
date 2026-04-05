const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const restartBtn = document.getElementById('restart-btn');

// Game Constants
const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = gridSize * tileCount;

// Game State
let worm = [];
let food = { x: 10, y: 10 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let gameSpeed = 100;
let nextDx = 0;
let nextDy = 0;
let gameLoopTimeout;

// Initialize Game
function initGame() {
    worm = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1;
    nextDx = 0;
    nextDy = -1;
    score = 0;
    scoreElement.innerText = score;
    loadHighScore();
    resetFood();
    overlay.classList.add('hidden');
    // Top scores are always visible now
    gameLoop();
}

function loadHighScore() {
    const savedHighScore = getFromStorage('wormHighScore');
    let scores = [];
    try {
        if (savedHighScore) {
            scores = JSON.parse(savedHighScore);
        }
    } catch (e) {
        scores = [];
    }

    if (scores.length > 0) {
        highScore = scores[0].score;
        highScoreElement.innerText = highScore;
        displayTopScores(scores);
    } else {
        highScore = 0;
        highScoreElement.innerText = 0;
    }
}

function saveHighScore() {
    const savedHighScore = getFromStorage('wormHighScore');
    let scores = [];
    try {
        if (savedHighScore) {
            scores = JSON.parse(savedHighScore);
        }
    } catch (e) {
        scores = [];
    }

    const newEntry = {
        score: score,
        timestamp: new Date().toLocaleString()
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);

    saveToStorage('wormHighScore', JSON.stringify(scores));

    highScore = scores[0].score;
    highScoreElement.innerText = highScore;
    displayTopScores(scores);
}

function displayTopScores(scores) {
    const container = document.getElementById('top-scores-container');
    const tbody = document.getElementById('high-scores-body');

    if (scores.length > 0) {
        container.classList.remove('hidden');
        tbody.innerHTML = '';
        scores.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry.score}</td><td>${entry.timestamp}</td>`;
            tbody.appendChild(row);
        });
    } else {
        container.classList.add('hidden');
    }
}

// Storage Helpers
function saveToStorage(key, value) {
    localStorage.setItem(key, value);
}

function getFromStorage(key) {
    return localStorage.getItem(key);
}

// Game Logic
function gameLoop() {
    if (didGameEnd()) {
        gameOver();
        return;
    }

    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        drawFood();
        advanceWorm();
        drawWorm();
        gameLoop();
    }, gameSpeed);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWorm() {
    worm.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#00ff41' : '#008f11';
        ctx.strokeStyle = '#000';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function advanceWorm() {
    dx = nextDx;
    dy = nextDy;
    const head = { x: worm[0].x + dx, y: worm[0].y + dy };

    // Wrap-around logic
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    worm.unshift(head);

    const didEatFood = worm[0].x === food.x && worm[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreElement.innerText = score;
        if (typeof window.playEatSound === 'function') window.playEatSound();
        resetFood();
        if (gameSpeed > 50) gameSpeed -= 1;
    } else {
        worm.pop();
    }
}

function didGameEnd() {
    for (let i = 1; i < worm.length; i++) {
        if (worm[i].x === worm[0].x && worm[i].y === worm[0].y) return true;
    }
    return false;
}

function resetFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't spawn on worm
    worm.forEach(part => {
        if (part.x === food.x && part.y === food.y) resetFood();
    });
}

function drawFood() {
    ctx.fillStyle = '#ff003c';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff003c';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
    ctx.shadowBlur = 0;
}

function gameOver() {
    overlayText.innerText = 'GAME OVER';
    overlay.classList.remove('hidden');
    saveHighScore();
    if (typeof window.playGameOverSound === 'function') window.playGameOverSound();
}

// Controls
document.addEventListener('keydown', event => {
    const key = event.key;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((key === 'ArrowUp' || key === 'w' || key === 'W') && !goingDown) {
        nextDx = 0;
        nextDy = -1;
    }
    if ((key === 'ArrowDown' || key === 's' || key === 'S') && !goingUp) {
        nextDx = 0;
        nextDy = 1;
    }
    if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && !goingRight) {
        nextDx = -1;
        nextDy = 0;
    }
    if ((key === 'ArrowRight' || key === 'd' || key === 'D') && !goingLeft) {
        nextDx = 1;
        nextDy = 0;
    }
});

restartBtn.addEventListener('click', () => {
    gameSpeed = 100;
    initGame();
});

// Start game
initGame();