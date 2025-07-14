const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

class Player {
  constructor() {
    this.width = 50;
    this.height = 30;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 5;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.jumpForce = -10;
    this.isJumping = false;
  }

  draw() {
    // A simple pixel art crab
    const crabPixels = [
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0],
    ];

    const pixelSize = 5;
    this.width = crabPixels[0].length * pixelSize;
    this.height = crabPixels.length * pixelSize;

    ctx.fillStyle = 'red';
    for (let y = 0; y < crabPixels.length; y++) {
      for (let x = 0; x < crabPixels[y].length; x++) {
        if (crabPixels[y][x] === 1) {
          ctx.fillRect(this.x + x * pixelSize, this.y + y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }

  update() {
    // Handle horizontal movement
    if (keys['ArrowLeft'] && this.x > 0) {
      this.x -= this.speed;
    }
    if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
      this.x += this.speed;
    }
  }
}

const player = new Player();
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

class Obstacle {
  constructor() {
    this.width = 50;
    this.height = 20;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = 2;
  }

  draw() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -this.height;
      this.x = Math.random() * (canvas.width - this.width);
    }
  }
}

const obstacles = [];
for (let i = 0; i < 3; i++) {
  obstacles.push(new Obstacle());
}


let score = 0;
let backgroundY = 0;
let gameOver = false;
let gameFrame = 0;

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
    return;
  }
  // Move the background
  backgroundY += 1;
  if (backgroundY >= canvas.height) {
    backgroundY = 0;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the scrolling background
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, backgroundY, canvas.width, canvas.height);
  ctx.fillRect(0, backgroundY - canvas.height, canvas.width, canvas.height);

  // Add and update obstacles
  if (gameFrame % 50 === 0) {
    obstacles.push(new Obstacle());
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.speed += 0.001;
    obstacle.update();
    obstacle.draw();

    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
    }

    // Check for collision with player
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
    }
  });


  // Update and draw the player
  player.update();
  player.draw();

  // Update the score
  score += 0.1;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);

  gameFrame++;
  requestAnimationFrame(gameLoop);
}

gameLoop();
