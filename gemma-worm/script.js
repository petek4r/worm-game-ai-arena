const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game state
let score = 0;
let dx = 0;
let dy = 0;
let worm = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
];
let food = { x: 5, y: 5 };
let nextDirection = { dx: 0, dy: -1 };

// Start the game
function main() {
    if (didGameEnd()) {
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceWorm();
        drawWorm();
        main();
    }, 100); // Game speed (100ms)
}

function resetGame() {
    score = 0;
    scoreElement.innerHTML = score;
    dx = 0;
    dy = 0;
    nextDirection = { dx: 0, dy: -1 };
    worm = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    createFood();
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWorm() {
    worm.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#81C784';
        ctx.strokeStyle = 'black';
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function advanceWorm() {
    // Update direction from buffered nextDirection
    dx = nextDirection.dx;
    dy = nextDirection.dy;

    const head = { x: worm[0].x + dx, y: worm[0].y + dy };
    worm.unshift(head);

    const didEatFood = worm[0].x === food.x && worm[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreElement.innerHTML = score;
        createFood();
    } else {
        worm.pop();
    }
}

function didGameEnd() {
    // Hit walls
    const hitLeftWall = worm[0].x < 0;
    const hitRightWall = worm[0].x > tileCount - 1;
    const hitTopWall = worm[0].y < 0;
    const hitBottomWall = worm[0].y > tileCount - 1;

    // Hit self
    let hitSelf = false;
    for (let i = 4; i < worm.length; i++) {
        if (worm[i].x === worm[0].x && worm[i].y === worm[0].y) {
            hitSelf = true;
            break;
        }
    }

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitSelf;
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on worm body
    worm.forEach(part => {
        if (part.x === food.x && part.y === food.y) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = '#F44336';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const W = 87;
    const A = 65;
    const S = 83;
    const D = 68;

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

document.addEventListener('keydown', changeDirection);

// Initialize game
createFood();
main();