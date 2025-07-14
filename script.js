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
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // Handle horizontal movement
    if (keys['ArrowLeft'] && this.x > 0) {
      this.x -= this.speed;
    }
    if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
      this.x += this.speed;
    }

    // Handle jumping
    if (keys['Space'] && !this.isJumping) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
    }

    // Apply gravity
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    // Platform collision
    platforms.forEach(platform => {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y &&
        this.y + this.height < platform.y + platform.height &&
        this.velocityY > 0
      ) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isJumping = false;
      }
    });

    // Prevent falling through the bottom of the canvas
    if (this.y > canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isJumping = false;
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

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * -canvas.height;
  }

  draw() {
    ctx.fillStyle = 'purple';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += 2;
    if (this.y > canvas.height) {
      this.y = Math.random() * -canvas.height;
      this.x = Math.random() * (canvas.width - this.width);
    }
  }
}

const platforms = [];
for (let i = 0; i < 10; i++) {
  platforms.push(new Platform(Math.random() * (canvas.width - 100), i * 100));
}

const enemies = [];
for (let i = 0; i < 3; i++) {
  enemies.push(new Enemy());
}


let score = 0;
let backgroundY = 0;

let gameOver = false;

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
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

  // Draw and update platforms
  platforms.forEach(platform => {
    platform.y += 1;
    if (platform.y > canvas.height) {
      platform.y = 0;
      platform.x = Math.random() * (canvas.width - 100);
    }
    platform.draw();
  });

  // Draw and update enemies
  enemies.forEach(enemy => {
    enemy.update();
    enemy.draw();

    // Check for collision with player
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver = true;
    }
  });


  // Update and draw the player
  player.update();
  player.draw();

  // Check for falling off the screen
  if (player.y > canvas.height) {
    gameOver = true;
  }

  // Update the score
  score++;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);


  requestAnimationFrame(gameLoop);
}

gameLoop();
