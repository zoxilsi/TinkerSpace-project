<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# KeyMystery Game Development Instructions

This is a web-based memory keystroke challenge game called KeyMystery. The project uses vanilla HTML, CSS, and JavaScript to create an engaging typing game with randomized keyboard mappings.

## Project Structure

- `index.html` - Main HTML file with complete game interface
- `styles/main.css` - Comprehensive CSS with cosmic theme and responsive design
- `js/game.js` - Core game logic, key mapping, and scoring system
- `js/ui.js` - User interface management and navigation
- `js/audio.js` - Audio system with procedural sound generation
- `js/storage.js` - Local storage management and data persistence

## Key Features

- **Randomized keyboard mappings** that change each game/level
- **Multiple game modes**: Word Typing, Memory Recall, Speed Challenge, Pattern Match
- **Progressive difficulty** with adaptive challenges
- **Comprehensive scoring system** with achievements
- **Beautiful UI** with cosmic theme and smooth animations
- **Audio feedback** with dynamic sound generation
- **Local data persistence** for settings and statistics
- **Responsive design** for desktop and mobile

## Development Guidelines

When working on this project:

1. **Maintain the modular architecture** - Keep game logic, UI, audio, and storage separate
2. **Preserve the cosmic theme** - Use the established color palette and design language
3. **Ensure accessibility** - Maintain keyboard navigation and screen reader compatibility
4. **Test on multiple devices** - The game should work on both desktop and mobile
5. **Consider performance** - Optimize animations and audio for smooth gameplay
6. **Maintain data integrity** - Always validate data when reading from localStorage

## Game Mechanics

- Keys are randomly mapped at game start (A→K, B→R, etc.)
- Players must learn the new mappings to type target words
- Scoring based on accuracy, speed, and game mode multipliers
- Achievement system tracks various milestones
- Progressive difficulty increases challenge over time

## Code Style

- Use ES6+ features appropriately
- Maintain consistent naming conventions
- Add comments for complex logic
- Keep functions focused and modular
- Handle errors gracefully with try-catch blocks

The game emphasizes cognitive training through typing challenges while providing an engaging and visually appealing experience.
