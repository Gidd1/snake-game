# Snake

A simple Snake game that runs in any browser. No build step, no dependencies.

**Play online:** `https://YOUR-USERNAME.github.io/snake-game/` (after enabling GitHub Pages, see below)

## Features
- Arrow keys / WASD, on-screen buttons, or swipe on a phone
- Speeds up as you score
- Best score saved in your browser
- Pause with Space

## Run locally
Open `index.html` in a browser. That's all.

Or serve it locally:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure
```
index.html   page layout
style.css    look and feel
game.js      game logic (grid, movement, scoring, input)
docs/        design notes
.github/workflows/pages.yml   auto-deploy to GitHub Pages
```

## Publish on GitHub
```bash
cd snake-game
git init
git add .
git commit -m "Add Snake game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/snake-game.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source: GitHub Actions**. Each push to `main` redeploys the game.

## Ideas for next steps
- Sound effects
- Walls that wrap around instead of ending the game
- Difficulty levels
- Online leaderboard

## License
MIT, see [LICENSE](LICENSE).
