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
let food = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let nextDirection = {dx: 0, dy: -1};
let gameTimeout = null;

// Initialize game
function init() {
    // Prevent scrolling with arrow keys
    document.addEventListener('keydown', (e) => {
        if ([37, 38, 39, 40, 87, 65, 83, 68].includes(e.keyCode)) {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', changeDirection);

    if (restartBtn) {
        restartBtn.addEventListener('click', resetGame);
    }

    loadHighScoresFromCookies();
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
    nextDirection = {dx: 0, dy: -1};
    createFood();
    gameLoop();
}

function gameLoop() {
    if (didGameEnd()) {
        saveHighScoreToCookies(score);
        loadHighScoresFromCookies();
        // Use a slight delay so the user sees the final frame before the alert
        setTimeout(() => {
            alert(`MISSION FAILED\nSCORE: ${score}`);
            resetGame();
        }, 100);
        return;
    }

    gameTimeout = setTimeout(function onTick() {
        // Apply the buffered direction
        dx = nextDirection.dx;
        dy = nextDirection.dy;

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
    ctx.fillStyle = '#0f0';
    worm.forEach((part, index) => {
        // Make the head a slightly different color
        ctx.fillStyle = index === 0 ? '#0f0' : '#0a0';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function advanceWorm() {
    const head = {x: worm[0].x + dx, y: worm[0].y + dy};
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
    const head = worm[0];
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // Self collision
    for (let i = 1; i < worm.length; i++) {
        if (head.x === worm[i].x && head.y === worm[i].y) {
            return true;
        }
    }
    return false;
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Ensure food doesn't spawn on worm
    if (worm.some(part => part.x === food.length && part.y === food.y)) {
        createFood();
    }
}

// Corrected check for food collision
function createFoodFixed() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    if (worm.some(part => part.x === food.x && part.y === food.y)) {
        createFoodFixed();
    }
}

function drawFood() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function changeDirection(e) {
    const keyPressed = e.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const W = 87, A = 65, S = 83, D = 68;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((keyPressed === LEFT || keyPressed === A) && !goingRight) {
        nextDirection = {dx: -1, dy: 0};
    }
    if ((keyPressed === UP || keyPressed === W) && !goingDown) {
        nextDirection = {dx: 0, dy: -1};
    }
    if ((keyPressed === RIGHT || keyPressed === D) && !goingLeft) {
        nextDirection = {dx: 1, dy: 0};
    }
    if ((keyPressed === DOWN || keyPressed === S) && !goingUp) {
        nextDirection = {dx: 0, dy: 1};
    }
}

function updateScore() {
    if (scoreElement) scoreElement.innerText = `SCORE: ${score}`;
}

function saveHighScoreToCookies(newScore) {
    if (newScore <= 0) return;

    let highScores = loadHighScoresFromCookies(true);

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

    document.cookie = `wormHighScores=${encodeURIComponent(JSON.stringify(highScores))}; path=/; max-age=31536000`;
}

function loadHighScoresFromCookies(onlyReturnData = false) {
    const nameEQ = "wormHighScores=";
    const ca = document.cookie.split(';');
    let scores = [];

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            try {
                const cookieValue = c.substring(nameEQ.length, c.length);
                scores = JSON.parse(decodeURIComponent(cookieValue));
            } catch (e) {
                console.error("Error parsing high scores cookie", e);
                scores = [];
            }
            break;
        }
    }

    if (!onlyReturnData && highScoresListElement) {
        highScoresListElement.innerHTML = '';
        scores.forEach(item => {
            const div = document.createElement('div');
            div.className = 'high-score-item';
            div.innerHTML = `<span class="score-val">${item.score}</span><span class="hs-date">${item.time}</span>`;
            highScoresListElement.appendChild(div);
        });
    }

    return scores;
}

// Start the game
init();