const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_SPEED = 6;

// Ball
const BALL_SIZE = 16;

// Player paddle (left)
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// AI paddle (right)
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball position and velocity
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = Math.random() < 0.5 ? 5 : -5;
let ballSpeedY = (Math.random() * 4) - 2;

// Track mouse for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2));
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw net
    ctx.fillStyle = '#fff';
    for (let i = 0; i < HEIGHT; i += 32) {
        ctx.fillRect(WIDTH / 2 - 2, i, 4, 16);
    }

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // player
    ctx.fillRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update game state
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with top and bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(HEIGHT - BALL_SIZE, ballY));
    }

    // Collision with player paddle
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add a little "spin"
        const deltaY = ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
    }

    // Collision with AI paddle
    if (
        ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        // Add a little "spin"
        const deltaY = ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25;
    }

    // Score check (reset ball)
    if (ballX < 0 || ballX > WIDTH) {
        ballX = WIDTH / 2 - BALL_SIZE / 2;
        ballY = HEIGHT / 2 - BALL_SIZE / 2;
        ballSpeedX = Math.random() < 0.5 ? 5 : -5;
        ballSpeedY = (Math.random() * 4) - 2;
    }

    // Simple AI for right paddle
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 8) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 8) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();