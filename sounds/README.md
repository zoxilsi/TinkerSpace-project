# Audio Files

This directory contains audio files for the KeyMystery game. Currently, the game uses procedural audio generation through the Web Audio API, so these files are not required for the game to function.

## Placeholder Files

If you want to use actual audio files instead of generated sounds, you can add:

- `key-press.mp3` - Sound for key presses
- `success.mp3` - Sound for successful word completion
- `error.mp3` - Sound for typing errors

The audio system in `js/audio.js` will automatically fall back to procedural generation if these files are not found.
