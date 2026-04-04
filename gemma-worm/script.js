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
        // Prevent scrolling with arrow keys
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
    // Clear any existing loop
    if (gameTimeout) clearTimeout(gameTimeout);

    // Reset state
    score = 0;
    updateScore();
    // Start worm in a vertical line
    worm = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    // Set initial movement direction so it starts moving immediately
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
        alert(`Game Over! Your score: ${score}`);
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWorm() {
    worm.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#2e7d32' : '#81c784';
        ctx.strokeStyle = 'white';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function advanceWorm() {
    // Apply the buffered direction
    dx = nextDirection.dx;
    dy = nextDirection.dy;

    const head = { x: worm[0].x + dx, y: worm[0].y + dy };

    // Wall wrapping logic
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    worm.unshift(head);

    // Check if food was eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        createFood();
    } else {
        worm.pop();
    }
}

function didGameEnd() {
    // Check for self-collision
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

    // Ensure food doesn't spawn on the worm body
    for (let i = 0; i < worm.length; i++) {
        if (worm[i].x === food.x && worm.y === food.y) {
            createFood();
            break;
        }
    }
}

function drawFood() {
    ctx.fillStyle = '#F44336';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
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

// Score management
function updateScore() {
    scoreElement.innerHTML = `Score: ${score}`;
}

function saveHighScore(newScore) {
    if (newScore <= 0) return;
    let highScores = JSON.parse(localStorage.getItem('wormHighScores')) || [];
    const entry = {
        score: newScore,
        date: new Date().toLocaleDateString()
    };
    highScores.push(entry);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    localStorage.setItem('wormHighScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const highScores = JSON.parse(localStorage.getItem('wormHighScores')) || [];
    highScoresListElement.innerHTML = '';
    highScores.forEach(item => {
        const div = document.createElement('div');
        div.className = 'high-score-item';
        div.innerHTML = `<span>${item.score}</span><span>${item.date}</span>`;
        highScoresListElement.appendChild(div);
    });
}

// Start the game
init();