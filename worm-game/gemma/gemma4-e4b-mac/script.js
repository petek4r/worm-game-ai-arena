// =========================================================
// script.js: Game Logic and State Management (Canvas API Version)
// =========================================================

// --- Constants & Global State ---
const GRID_WIDTH = 40;
const GRID_HEIGHT = 20;
const TILE_SIZE = 10;

// Canvas context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let snake = [];
let food = null;
let score = 0;
let dx = 1; // Direction X (starts moving right by default)
let dy = 0; // Direction Y
let gameState = 'ready'; // Possible states: 'ready', 'running', 'paused', 'gameover'
let gameLoopInterval; // To store the interval ID for stopping the game

// --- DOM Element References ---
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const statusDisplay = document.getElementById('status');
const messageOverlay = document.getElementById('message-overlay');
const finalMessageDisplay = document.getElementById('final-message');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');


// =========================================================
// GAME UTILITIES
// ============================================================

function saveGameData() {
    // Placeholder for saving state if needed
}

function loadGameData() {
    // Placeholder for loading state if needed
}

function resetGame() {
    // Reset variables and position
    saveGameData();
}

// --- Core Game Logic ---

function updateGame() {
    if (!gameRunning) return;

    // 1. Calculate new head position
    const head = { x: 0, y: 0 };
    if (snake.length > 0) {
        head.x = snake[0].x + (snake[0].dx || 1);
        head.y = snake[0].y + (snake[0].dy || 0);
    }

    // 2. Check for collision (walls or self)
    if (checkWallCollision(head) || checkSelfCollision(head)) {
        gameOver();
        return;
    }

    // 3. Update snake body
    const newSnakeHead = { x: head.x, y: head.y };
    snake.unshift(newSnakeHead);
    snake[0].dx = head.x - snake[0].x;
    snake[0].dy = head.y - snake[0].y;

    // 4. Check for food collision
    let ateFood = false;
    const food = getFoodPosition(); // Assuming a function to get food pos
    if (food && newSnakeHead.x === food.x && newSnakeHead.y === food.y) {
        ateFood = true;
        updateFoodPosition(); // Function to move food
        score++;
    }

    // 5. Update body segments (if no food was eaten)
    if (!ateFood) {
        snake.pop(); // Remove tail if no food was eaten
    }

    // 6. Redraw everything
    drawGame();
    updateScoreDisplay();
}

function checkWallCollision(head) {
    // Check boundaries (0 to GRID_SIZE - 1)
    const GRID_SIZE = 20;
    return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
}

function checkSelfCollision(head) {
    // Check if head hits any body part after the first segment
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}


function gameOver() {
    gameRunning = false;
    // Display Game Over screen
    console.log("GAME OVER! Score:", score);
}

function gameLoop() {
    if (!gameRunning) return;

    // Simplified control input (assumes directional input handles dx/dy updates)
    // In a real implementation, input listeners would update snake[0].dx/dy before calling updateGame

    updateGame();
    setTimeout(gameLoop, 100); // Game speed control
}

// --- Placeholder Functions (For completeness) ---
const snake = [{x: 10, y: 10, dx: 0, dy: 0}];
let gameRunning = false;
let score = 0;
let food = {x: 5, y: 5};

function getFoodPosition() { return food; }
function updateFoodPosition() { /* Logic to move food */ }
function drawGame() { /* Logic to draw snake and food */ }
function updateScoreDisplay() { console.log("Score:", score); }


// --- Controls ---
function setDirection(newDx, newDy) {
    // Simple anti-reversal logic
    if (newDx !== -snake[0].dx && newDy !== -snake[0].dy) {
        snake[0].dx = newDx;
        snake[0].dy = newDy;
    }
}

function startGame() {
    score = 0;
    snake.length = 0; // Reset snake structure
    snake.push({x: 10, y: 10, dx: 0, dy: 0});

    // Set initial direction (e.g., pointing right)
    snake[0].dx = 1;
    snake[0].dy = 0;

    food = {x: 5, y: 5}; // Reposition food

    gameRunning = true;
    gameLoop();
    console.log("Game Started!");
}

// Example input setup (In a real app, this would be event listeners)
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.key) {
        case 'ArrowUp':
            setDirection(0, -1);
            break;
        case 'ArrowDown':
            setDirection(0, 1);
            break;
        case 'ArrowLeft':
            setDirection(-1, 0);
            break;
        case 'ArrowRight':
            setDirection(1, 0);
            break;
    }
});


// --- Initialization ---
startGame();