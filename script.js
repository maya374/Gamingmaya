const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

canvas.width = 400; canvas.height = 600;

let gameLoop, score, player, bullets, enemies, particles, keysPressed, isRunning;

function init() {
  score = 0;
  player = { x: 180, y: 500, w: 40, h: 40, cooldown: 0 };
  bullets = [];
  enemies = [];
  particles = [];
  keysPressed = {};
  isRunning = true;
  scoreEl.textContent = score;

  document.addEventListener('keydown', e => keysPressed[e.key] = true);
  document.addEventListener('keyup', e => keysPressed[e.key] = false);

  clearInterval(gameLoop);
  gameLoop = setInterval(update, 1000 / 60);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player movement
  if (keysPressed.ArrowLeft && player.x > 0) player.x -= 5;
  if (keysPressed.ArrowRight && player.x + player.w < canvas.width) player.x += 5;
  if (keysPressed.Space && player.cooldown <= 0) {
    bullets.push({ x: player.x + 18, y: player.y, w: 4, h: 10 });
    player.cooldown = 20;
  }
  if (player.cooldown > 0) player.cooldown--;

  // Spawn enemies
  if (Math.random() < 0.02) {
    enemies.push({ x: Math.random() * (canvas.width - 40), y: -40, w: 40, h: 40, speed: 2 + Math.random()*2 });
  }

  // Update bullets
  bullets = bullets.filter(b => {
    b.y -= 7;
    return b.y + b.h > 0;
  });

  // Update enemies
  enemies = enemies.filter(e => {
    e.y += e.speed;
    if (e.y > canvas.height) return false;
    return true;
  });

  // Collisions + score
  bullets.forEach((b,i) => {
    enemies.forEach((e,j) => {
      if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
        bullets.splice(i,1);
        enemies.splice(j,1);
        score += 10;
        scoreEl.textContent = score;
        spawnParticles(e.x + e.w/2, e.y + e.h/2);
      }
    });
  });

  // Game over?
  enemies.forEach(e => {
    if (e.x < player.x + player.w && e.x + e.w > player.x &&
        e.y < player.y + player.h && e.y + e.h > player.y) {
      endGame();
    }
  });

  draw();
}

function spawnParticles(x,y) {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5)*4,
      vy: (Math.random() - 0.5)*4,
      alpha: 1
    });
  }
}

function draw() {
  // Player ship
  ctx.fillStyle = '#0ff';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Bullets
  ctx.fillStyle = '#ff0';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Enemies
  ctx.fillStyle = '#f00';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));

  // Particles
  particles = particles.filter(p => {
    p.x += p.vx; p.y += p.vy; p.alpha -= 0.02;
    if (p.alpha <= 0) return false;
    ctx.fillStyle = `rgba(255,165,0,${p.alpha})`;
    ctx.fillRect(p.x, p.y, 4, 4);
    return true;
  });
}

function endGame() {
  isRunning = false;
  clearInterval(gameLoop);
  alert('Game Over! Score: ' + score);
}

startBtn.addEventListener('click', init);
