# Project Structure and Task Definition

## Overview
This project is designed to demonstrate how different LLMs manage the same task. The task is to create a simple worm game that works in a web browser using JavaScript. Each LLM's implementation will be placed in its own folder, allowing for easy comparison and demonstration.

## Task Definition
### Worm Game
Create a simple worm game that works in a web browser using JavaScript. The game should include the following features:
- A snake-like worm that moves around the screen.
- The ability to control the worm using keyboard inputs.
- The worm should grow longer when it eats food.
- The game should end when the worm collides with the walls or itself.
- Basic scoring system to track the worm's length.

## Project Structure
The project will be organized into folders for each LLM used. The structure will look like this:

```
project-root/
├── README.md
├── CLAUDE.md
├── .aiignore
├── README.md
├── memory.md
├── worm-game/
│   ├── index.html
│   └── script.js
├── qwen-worm/
│   ├── index.html
│   └── script.js
├── llama-worm/
│   ├── index.html
│   └── script.js
└── ... (other LLM folders)
```

## Implementation Notes
- Each LLM's implementation should be placed in its own folder.
- The `worm-game/` folder will contain a reference implementation or a base template.
- Each LLM's folder should contain:
  - `index.html`: The HTML file for the game.
  - `script.js`: The JavaScript file containing the game logic.

## Usage
1. Clone the repository.
2. Navigate to the project directory.
3. Open the `worm-game/` folder to see the reference implementation.
4. Open each LLM's folder to see their implementation.
5. Run the game by opening the `index.html` file in a web browser.

## Contributing
- Feel free to contribute by adding new LLM implementations or improving existing ones.
- Ensure that all changes are well-documented and follow the project's coding standards.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.