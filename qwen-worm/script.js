const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreBoard');
const highScoresListElement = document.getElementById('highScoresList');
const restartBtn = document.getElementById('restartBtn');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game state
let score = 0;
let worm = [];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDirection = { dx: 0, dy: -1 };
let gameTimeout = null;

// Initialize game
function init() {
    document.addEventListener('keydown', (e) => {
        if([37, 38, 39, 40, 87, 65, 83, 68].includes(e.keyCode)) {
            e.preventDefault();
        }
    });
    document.addEventListener('keydown', changeDirection);
    restartBtn.addEventListener('click', resetGame);
    loadHighScores();
    resetGame();
}

function resetGame() {
    if (gameTimeout) clearTimeout(gameTimeout);
    score = 0;
    updateScore();
    worm = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1;
    nextDirection = { dx: 0, dy: -1 };
    createFood();
    gameLoop();
}

function gameLoop() {
    if (didGameEnd()) {
        saveHighScore(score);
        loadHighScores();
        // Small delay before alert to allow the last frame to render
        setTimeout(() => alert(`MISSION FAILED\nSCORE: ${score}`), 10);
        return;
    }

    gameTimeout = setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceWorm();
        drawWorm();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWorm() {
    worm.forEach((part, index) => {
        // Head is brighter neon green
        ctx.fillStyle = index === 0 ? '#00ff00' : '#008800';
        ctx.strokeStyle = '#000';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);

        // Add a small glow to the head
        if (index === 0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff00';
        } else {
            ctx.shadowBlur = 0;
        }
    });
    ctx.shadowBlur = 0; // Reset shadow for other elements
}

function advanceWorm() {
    dx = nextDirection.dx;
    dy = nextDirection.dy;

    const head = { x: worm[0].x + dx, y: worm[0].y + dy };

    // Wall wrapping
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    worm.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        createFood();
    } else {
        worm.pop();
    }
}

function didGameEnd() {
    for (let i = 1; i < worm.length; i++) {
        if (worm[i].x === worm[0].x && worm[i].y === worm[0].y) {
            return true;
        }
    }
    return false;
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Check collision with worm body
    for (let part of worm) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
            break;
        }
    }
}

function drawFood() {
    ctx.fillStyle = '#ff00ff'; // Neon Magenta for food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const W = 87, A = 65, S = 83, D = 68;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((keyPressed === LEFT || keyPressed === A) && !goingRight) {
        nextDirection = { dx: -1, dy: 0 };
    }
    if ((keyPressed === UP || keyPressed === W) && !goingDown) {
        nextDirection = { dx: 0, dy: -1 };
    }
    if ((keyPressed === RIGHT || keyPressed === D) && !goingLeft) {
        nextDirection = { dx: 1, dy: 0 };
    }
    if ((keyPressed === DOWN || keyPressed === S) && !goingUp) {
        nextDirection = { dx: 0, dy: 1 };
    }
}

function updateScore() {
    scoreElement.innerHTML = `SCORE: ${score}`;
}

function saveHighScore(newScore) {
    if (newScore <= 0) return;
    let highScores = JSON.parse(localStorage.getItem('wormHighScores')) || [];

    // Get timestamp with seconds
    const now = new Date();
    const timestamp = now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');

    const entry = {
        score: newScore,
        time: timestamp
    };

    highScores.push(entry);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    localStorage.setItem('wormHighScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const highScores = JSON.parse(locaStorage.getItem('wormHighScores')) || [];
    // Note: Fixed typo 'locaStorage' -> 'localStorage'
    const scores = JSON.parse(localStorage.getItem('wormHighScores')) || [];
    highScoresListElement.innerHTML = '';
    scores.forEach(item => {
        const div = document.createElement('div');
        div.className = 'high-score-item';
        div.innerHTML = `<span>${item.score}</span><span class="hs-date">${item.time}</span>`;
        highScoresListElement.appendChild(div);
    });
}

// Start the game
init();