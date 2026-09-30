(() => {
  const SIZE = 20;              // grid is SIZE x SIZE cells
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CELL = canvas.width / SIZE;
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const overlay = document.getElementById("overlay");
  const message = document.getElementById("message");
  const startBtn = document.getElementById("start");

  const css = getComputedStyle(document.documentElement);
  const COLORS = {
    snake: css.getPropertyValue("--snake").trim(),
    food: css.getPropertyValue("--food").trim(),
    line: css.getPropertyValue("--line").trim(),
  };

  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  let snake, dir, nextDir, food, score, timer, running = false, paused = false;
  let best = 0;
  try { best = Number(localStorage.getItem("snake-best")) || 0; } catch (e) {}
  bestEl.textContent = best;

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = nextDir = DIRS.right;
    score = 0;
    scoreEl.textContent = 0;
    placeFood();
  }

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function speed() { return Math.max(60, 140 - score * 4); } // ms per move, faster as you score

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(tick, speed());
  }

  function tick() {
    if (!running || paused) return;
    dir = nextDir;
    const head = { x: snake[0].x + dir[0], y: snake[0].y + dir[1] };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;
    const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);
    if (hitWall || hitSelf) return gameOver();

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
    schedule();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 0.5;
    for (let i = 1; i < SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
    }
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.38, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((s, i) => {
      ctx.fillStyle = COLORS.snake;
      ctx.globalAlpha = i === 0 ? 1 : 0.85;
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.globalAlpha = 1;
  }

  function showOverlay(text, button) {
    message.textContent = text;
    startBtn.textContent = button;
    overlay.classList.remove("hidden");
  }

  function start() {
    reset();
    running = true;
    paused = false;
    overlay.classList.add("hidden");
    draw();
    schedule();
  }

  function gameOver() {
    running = false;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem("snake-best", best); } catch (e) {}
    }
    showOverlay(`Game over. You scored ${score}.`, "Play again");
  }

  function togglePause() {
    if (!running) return;
    paused = !paused;
    if (paused) showOverlay("Paused", "Resume");
    else { overlay.classList.add("hidden"); schedule(); }
  }

  function steer(name) {
    const d = DIRS[name];
    if (!d || !running || paused) return;
    // ignore a direct reversal
    if (d[0] === -dir[0] && d[1] === -dir[1]) return;
    nextDir = d;
  }

  startBtn.addEventListener("click", () => (running && paused ? togglePause() : start()));

  document.addEventListener("keydown", e => {
    const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
                  w: "up", s: "down", a: "left", d: "right" };
    if (map[e.key]) { e.preventDefault(); steer(map[e.key]); }
    else if (e.key === " ") {
      e.preventDefault();
      running ? togglePause() : start();
    }
  });

  document.querySelectorAll(".pad button").forEach(b =>
    b.addEventListener("click", () => steer(b.dataset.dir)));

  // swipe on the board
  let touch = null;
  canvas.addEventListener("touchstart", e => { touch = e.touches[0]; }, { passive: true });
  canvas.addEventListener("touchend", e => {
    if (!touch) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.clientX, dy = t.clientY - touch.clientY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
      steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    }
    touch = null;
  }, { passive: true });

  reset();
  draw();
})();
