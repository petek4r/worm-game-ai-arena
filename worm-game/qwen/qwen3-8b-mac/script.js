// worm-game/qwen/qwen3-8b-mac/script.js
const gridSize = 20;
const gameContainer = document.getElementById('game-container');
const highScoresList = document.getElementById('high-scores');

let score = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Add a new high score
function addHighScore(name, score) {
    const newScore = { name, score, time: new Date().toLocaleString() };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    renderHighScores();
}

// Render high scores
function renderHighScores() {
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name} - ${score.score} (${score.time})`;
        highScoresList.appendChild(li);
    });
}

// Initialize game
function initGame() {
    score = 0;
    document.getElementById('scoreboard').querySelector('h2').textContent = `Score: ${score}`;
    renderHighScores();
    startGame();
}

// Start the game
function startGame() {
    const game = document.getElementById('game-canvas');
    game.innerHTML = '';
    const worm = createWorm();
    const food = createFood(worm);

    // Add event listener for keyboard input
    document.addEventListener('keydown', handleInput);

    // Game loop
    function gameLoop() {
        moveWorm(worm, food);
        renderGame(worm, food);
        checkCollision(worm);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Restart the game
function restartGame() {
    // Reset score
    score = 0;
    document.getElementById('scoreboard').querySelector('h2').textContent = `Score: ${score}`;
    renderHighScores();
    startGame();
}

// Create the worm
function createWorm() {
    const worm = [];
    for (let i = 0; i < 4; i++) {
        worm.push({
            x: 2 + i,
            y: 2,
            direction: 'RIGHT'
        });
    }
    return worm;
}

// Create food
function createFood(worm) {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (worm.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
}

// Move the worm
function moveWorm(worm, food) {
    const head = { ...worm[0] };

    // Change direction based on keyboard input
    switch (head.direction) {
        case 'UP':
            head.y--;
            break;
        case 'DOWN':
            head.y++;
            break;
        case 'LEFT':
            head.x--;
            break;
        case 'RIGHT':
            head.x++;
            break;
    }

    // Wrap around the screen
    if (head.x < 0) head.x = gridSize - 1;
    if (head.x >= gridSize) head.x = 0;
    if (head.y < 0) head.y = gridSize - 1;
    if (head.y >= gridSize) head.y = 0;

    // Check if the worm ate the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('scoreboard').querySelector('h2').textContent = `Score: ${score}`;
        window.playEatSound();
        food = createFood(worm);
    } else {
        worm.pop(); // Remove the tail segment
    }

    // Add the new head to the worm
    worm.unshift(head);
}

// Render the game
function renderGame(worm, food) {
    const game = document.getElementById('game-canvas');
    game.innerHTML = '';

    // Draw the food
    const foodDiv = document.createElement('div');
    foodDiv.classList.add('cell', 'food');
    foodDiv.style.left = `${food.x * 20}px`;
    foodDiv.style.top = `${food.y * 20}px`;
    game.appendChild(foodDiv);

    // Draw the worm
    worm.forEach(segment => {
        const div = document.createElement('div');
        div.classList.add('cell', 'body');
        div.style.left = `${segment.x * 20}px`;
        div.style.top = `${segment.y * 20}px`;
        game.appendChild(div);
    });
}

// Check for collisions
function checkCollision(worm) {
    // Check if the worm collided with itself
    for (let i = 1; i < worm.length; i++) {
        if (worm[0].x === worm[i].x && worm[0].y === worm[i].y) {
            window.playGameOverSound();
            endGame();
            return;
        }
    }
}

// End the game
function endGame() {
    // Add the current score to high scores
    const name = prompt("Enter your name for the high score:", "Player");
    if (name) {
        addHighScore(name, score);
    }

    // Show game over message
    const game = document.getElementById('game-canvas');
    game.innerHTML = `<h2>Game Over</h2><p>Your score: ${score}</p>`;
    game.style.position = 'absolute';
    game.style.width = '100%';
    game.style.height = '100%';
    game.style.textAlign = 'center';
    game.style.lineHeight = '400px';
    game.style.fontSize = '24px';
    game.style.color = '#0f0';
}

// Handle keyboard input
function handleInput(event) {
    const key = event.key;
    const worm = document.getElementById('game-canvas').querySelectorAll('.body');

    // Determine the direction based on the key pressed
    let newDirection;
    switch (key) {
        case 'ArrowUp':
        case 'w':
            newDirection = 'UP';
            break;
        case 'ArrowDown':
        case 's':
            newDirection = 'DOWN';
            break;
        case 'ArrowLeft':
        case 'a':
            newDirection = 'LEFT';
            break;
        case 'ArrowRight':
        case 'd':
            newDirection = 'RIGHT';
            break;
        default:
            return;
    }

    // Prevent the worm from reversing direction
    const head = worm[0];
    if (newDirection === 'UP' && head.getAttribute('data-direction') === 'DOWN') return;
    if (newDirection === 'DOWN' && head.getAttribute('data-direction') === 'UP') return;
    if (newDirection === 'LEFT' && head.getAttribute('data-direction') === 'RIGHT') return;
    if (newDirection === 'RIGHT' && head.getAttribute('data-direction') === 'LEFT') return;

    // Update the direction of the worm
    worm.forEach(segment => {
        segment.setAttribute('data-direction', newDirection);
    });
}

// Initialize the game
document.getElementById('start-game').addEventListener('click', initGame);

// Add start game button
const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
startButton.id = 'start-game';
startButton.addEventListener('click', initGame);
document.body.appendChild(startButton);