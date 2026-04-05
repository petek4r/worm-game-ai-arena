# Project History & Evolution

## Structural Refactor (Current State)
- **Transition**: Moved from a flat root directory structure to a hierarchical one.
- **Original Path**: `gemma-worm/`, `qwen-worm/`
- **New Path**: `gemma/pc-worm/`, `qwen/pc-worm/`
- **Reasoning**: To separate development environments (PC vs. Mac) and allow for multi-platform scaling.

## Logic Evolution
- **Phase 1 (Initialization)**: Fixed broken game start by implementing core movement and cookie parsing functions.
- **Phase 2 (Bug Fixes)**: Resolved `ReferenceError` in `resetGame` (typo in `gameTimeout`).
- **Phase 3 (Feature Implementation)**: Replaced wall-collision death with "wrap-around" logic in `advanceWorm`.