const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = { x: 180, y: 500, width: 40, height: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawPlayer() {
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullet(bullet) {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawEnemy(enemy) {
  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -40, width: 40, height: 40 });
}

function updateGame() {
  // Move player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += 5;
  if (keys[" "]) {
    bullets.push({ x: player.x + 18, y: player.y, width: 4, height: 10 });
    keys[" "] = false;
  }

  // Move bullets
  bullets.forEach(b => b.y -= 5);
  bullets = bullets.filter(b => b.y > 0);

  // Move enemies
  enemies.forEach(e => e.y += 2);
  enemies = enemies.filter(e => e.y < canvas.height);

  // Collision detection
  bullets.forEach((b, i) => {
    enemies.forEach((e, j) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        score += 10;
        document.getElementById("score").textContent = score;
      }
    });
  });

  // Game over
  enemies.forEach(e => {
    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  bullets.forEach(drawBullet);
  enemies.forEach(drawEnemy);
}

setInterval(spawnEnemy, 1000);

function gameLoop() {
  updateGame();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
