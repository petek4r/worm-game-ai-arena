# Project Architecture: Gemma/Qwen Worm

## Core Logic
- **Engine**: HTML5 Canvas 2D API.
- **Game Loop**: Recursive `setTimeout` implementation.
- **Movement**: Coordinate-based array manipulation.
- **Boundary Logic**: "Wrap-around" mechanics (coordinates wrap from edge to opposite edge).
- **Collision Detection**: Self-collision check (head vs body) via array indexing; boundary collision is disabled to support wrapping.

## Data Persistence
- **High Scores**: Stored in `document.cookie` using JSON serialization.
- **Format**: `decodeURIComponent(unescape(document.cookie))` pattern for parsing.

## Folder Hierarchy
- `gemma/pc-worm/`: Development branch for PC-based environments (Developed on: AMD Ryzen 5, 32GB RAM, NVIDIA RTX 5070 Ti 16GB).
- `qwen/pc-worm/`: Development branch for Qwen-optimized logic.
- Future iterations may include `mac-worm/` for macOS-specific development.