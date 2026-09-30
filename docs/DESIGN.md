# Design notes

## Rules
- The snake moves one cell per tick on a 20x20 grid.
- Eating food adds one point and grows the snake by one cell.
- Hitting a wall or the snake's own body ends the game.
- Speed: 140 ms per move at the start, minus 4 ms per point, never below 60 ms.

## How the code is organised (game.js)
| Function | Job |
|---|---|
| `reset()` | Set up a fresh snake, score and food |
| `tick()` | One game step: move, check collisions, eat, redraw |
| `draw()` | Paint grid, food and snake on the canvas |
| `steer()` | Accept a direction change, ignoring direct reversals |
| `gameOver()` | Stop the loop, save best score, show overlay |

## Input
- Keyboard: arrows or WASD, Space to start or pause
- Touch: swipe on the board, or the four on-screen buttons

## Storage
Best score is kept in the browser's `localStorage` under the key `snake-best`.
