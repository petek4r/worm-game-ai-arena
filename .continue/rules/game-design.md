# 🏛️ Retro Aesthetic & Audio Laws

## Visuals
- **Typography**: All CSS must use monospace fonts (e.g., 'Courier New', 'Lucida Console', or 'Fixedsys').
- **Palette**: Use a strict "Arcade" theme: Pure black backgrounds (#000) with Neon green, pink, or cyan accents.
- **Effects**: Implement a scanline overlay in `style.css` using a CSS linear gradient or semi-transparent pattern.

## Audio (Strict)
- **Dependency**: You MUST include `<script src="../../shared/sounds.js"></script>` in the `index.html` BEFORE your game script.
- **Execution**: Do NOT write raw Web Audio API code. You must use the following globally available functions from the shared library:
    - `window.playMoveSound()` -> Call when the worm changes direction or moves.
    - `window.playEatSound()` -> Call when the worm consumes food.
    - `window.playGameOverSound()` -> Call immediately upon self-collision.