// Game configuration
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;
const GRID_ROWS = CANVAS_HEIGHT / GRID_SIZE;
const GRID_COLS = CANVAS_WIDTH / GRID_SIZE;
const GAME_SPEED = 100; // milliseconds

// Game state
let worm = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = {};
let score = 0;
let highScore = parseInt(localStorage.getItem('wormHighScore')) || 0;
let gameInterval = null;
let isGameRunning = false;

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');
const scoreList = document.getElementById('score-list');

// Initialize game
function initGame() {
    // Create starting worm
    worm = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];

    // Set initial direction (moving right)
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    // Generate initial food
    generateFood();

    // Reset score
    score = 0;
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;

    // Clear existing interval if any
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // Start game loop
    gameInterval = setInterval(gameLoop, GAME_SPEED);

    // Draw initial frame
    draw();
}

function gameLoop() {
    if (!isGameRunning) return;

    // Update direction
    direction = nextDirection;

    // Move worm
    const head = {
        x: worm[0].x + direction.x,
        y: worm[0].y + direction.y
    };

    // Wrap around edges
    if (head.x < 0) head.x = GRID_COLS - 1;
    if (head.x >= GRID_COLS) head.x = 0;
    if (head.y < 0) head.y = GRID_ROWS - 1;
    if (head.y >= GRID_ROWS) head.y = 0;

    // Check for self-collision
    if (worm.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add new head
    worm.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        playEatSound();
        generateFood();
    } else {
        // Remove tail if no food eaten
        worm.pop();
    }

    // Draw
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = '#0a0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw worm
    ctx.fillStyle = '#0f0';
    worm.forEach((segment, index) => {
        // Head is brighter
        if (index === 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0f0';
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
        ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f00';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_COLS),
            y: Math.floor(Math.random() * GRID_ROWS)
        };
    } while (worm.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    food = newFood;
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);

    // Play game over sound
    playGameOverSound();

    // ALWAYS add this score to the list (not just high scores)
    const newScoreEntry = {
        score: score,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
    };

    // Get existing scores
    let scores = JSON.parse(localStorage.getItem('wormScores') || '[]');

    // Add this score
    scores.push(newScoreEntry);

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Take top 5
    scores = scores.slice(0, 5);

    // Update high score if this was a new high
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('wormHighScore', highScore.toString());
    }

    // Save back to localStorage
    localStorage.setItem('wormScores', JSON.stringify(scores));

    // Reload table
    loadHighScoreTable();

    // Update current high score display
    highScoreElement.textContent = highScore;

    // Show game over screen
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    gameOverScreen.style.display = 'flex';
}

function handleKeyPress(e) {
    // Prevent default scrolling
    e.preventDefault();

    // Get opposite direction
    const opposite = { x: -direction.x, y: -direction.y };

    // Prevent 180-degree turns
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
}

// Load and display high score table
function loadHighScoreTable() {
    // Get stored scores
    const scores = JSON.parse(localStorage.getItem('wormScores') || '[]');

    // Clear table
    scoreList.innerHTML = '';

    // Populate table with up to 5 entries
    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.score}</td>
            <td>${entry.date}</td>
            <td>${entry.time}</td>
        `;
        scoreList.appendChild(row);
    });
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.style.display = 'none';
    isGameRunning = true;
    initGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    isGameRunning = true;
    initGame();
});

// Initialize high score display
highScoreElement.textContent = highScore;

// Load high score table (will populate after first game over)
loadHighScoreTable();