# Project Structure and Task Definition

## Overview

This project is a competence development arena designed to demonstrate how different local LLMs manage the same coding
task. The current task is to create a simple worm (snake) game that works in a web browser using JavaScript, HTML, and
CSS. Each LLM's implementation is placed in its own dedicated folder hierarchy, allowing for easy comparison of
architectural choices and code quality.

## Task Definition

### Worm Game Requirements

Create a worm game that works in a web browser. The implementation must include the following features:

- **Core Mechanics:** A snake-like worm that moves around a grid and grows longer when it eats food.
- **Controls:** The ability to control the worm using standard keyboard inputs (Arrow keys / WASD).
- **Wrap-around Logic:** The worm can pass through the edges of the screen and appear on the opposite side (no
  wall-collision death).
- **Failure Condition:** The game should end only when the worm collides with its own body.
- **Scoring & Persistence:** A basic scoring system to track the current score, and a high-score system that persists data using localStorage. Table for top-5 scores with date and time.
- **Aesthetic:** The UI and styling should have a "retro" arcade feel (e.g., dark backgrounds, neon/glowing colors,
  monospace fonts, scanlines). 
- **Audio:** A shared audio library already exists at `../../shared/sounds.js`. You must include this script in your
  `index.html` and use its globally available `playRetroBeep(frequency, duration, type)` function for game sounds (e.g.,
  eating food, moving, game over). Do not write your own Web Audio API logic.
- All implementations must strictly follow the laws defined in `.continue/rules/`

## Project Structure

The project is organized using a "Task > Model Family > Specific Model" hierarchy. The structure looks like this:

```text
.
├── CLAUDE.md
├── MEMORY.md
├── PROGRESS.md
├── README.md
├── TASK.md
└── worm-game/
    ├── shared/
    │   └── sounds.js
    ├── gemma/
    │   ├── gemma4-26b-pc/
    │   │   ├── index.html
    │   │   ├── script.js
    │   │   └── style.css
    └── qwen/
        ├── qwen3-8b-pc/
        │   ├── index.html
        │   └── script.js
```

## Implementation Notes

- The root level contains global documentation and AI memory files.
- Each distinct coding challenge gets its own top-level directory (e.g., `worm-game/`).
- Inside the task directory, code is grouped by the LLM family (e.g., `gemma/`, `qwen/`).
- The final subfolder explicitly states the model version and the environment it was run on (e.g., `gemma4-26b-pc` or
  `qwen3-8b-mac`).
- Each specific model folder contains the actual generated `index.html`, `script.js`, and `style.css` files.

---
*Note: For project logistics, running instructions, and forking policies, please refer to the [README.md](README.md).*
