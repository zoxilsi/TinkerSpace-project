# KeyMystery 🎮

**A Fun Memory-Based Keystroke Challenge Game**

KeyMystery is an innovative web-based typing game where the keyboard keys are randomized, challenging players to learn and remember new key mappings while completing various word challenges, speed tests, and brain games.

![KeyMystery Game](https://via.placeholder.com/800x400/0f0f23/00d4ff?text=KeyMystery+Game)

## 🎯 Game Overview

In KeyMystery, every game session randomizes your keyboard mapping - pressing 'A' might result in the letter 'K', and pressing 'B' might output 'R'. Players must adapt to these new mappings to complete various challenges, improving memory, pattern recognition, and brain flexibility.

## ✨ Key Features

- **🔀 Randomized Key Mapping**: Every game or level scrambles the keyboard layout
- **🎮 Multiple Game Modes**: 
  - **Word Typing**: Type given words with scrambled keys
  - **Memory Recall**: Type without seeing the mappings (memory challenge)
  - **Speed Challenge**: Race against time with changing mappings
  - **Pattern Match**: Complete letter patterns and sequences
- **📊 Progress Tracking**: Comprehensive scoring system and statistics
- **🏆 Achievement System**: Unlock achievements as you improve
- **🎨 Beautiful UI**: Engaging cosmic-themed design with animations
- **🔊 Audio Feedback**: Dynamic sound effects and audio cues
- **💾 Local Storage**: Save your progress and settings
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Installation

1. **Clone or Download**: Download the project files to your local machine
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **Start Playing**: No additional setup required!

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Audio support (optional, for sound effects)

## 🎮 How to Play

### Basic Gameplay

1. **Choose a Game Mode**: Select from Word Typing, Memory Recall, Speed Challenge, or Pattern Match
2. **Study the Mappings**: At the start of each game, key mappings are displayed
3. **Type the Target**: Use the scrambled keyboard to type the target words or patterns
4. **Earn Points**: Score points based on accuracy and speed
5. **Level Up**: Progress through increasingly difficult levels

### Game Modes Explained

#### 📝 Word Typing
- Type given words using the scrambled keyboard
- Visual keyboard helper available
- Great for beginners learning the mechanics
- Difficulty: Easy • Medium • Hard

#### 🧠 Memory Recall
- Type words without seeing the key mappings
- Ultimate memory challenge
- Mappings hidden after initial display period
- Difficulty: Medium • Hard

#### ⚡ Speed Challenge
- Race against time with changing mappings
- New mappings generated as you progress
- Fast-paced action for experienced players
- Difficulty: Hard • Expert

#### 🧩 Pattern Match
- Complete letter sequences and patterns
- Focuses on pattern recognition
- Includes palindromes, sequences, and repeating patterns
- Difficulty: Medium • Hard

### Scoring System

- **Base Points**: 10 points per letter in completed word
- **Accuracy Bonus**: Up to 50 bonus points for high accuracy
- **Speed Bonus**: Additional points for fast completion
- **Mode Multipliers**: 
  - Memory Recall: 1.5x multiplier
  - Speed Challenge: 1.3x multiplier
  - Pattern Match: 1.2x multiplier

## 🛠️ Technical Details

### Built With

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No external dependencies
- **Web Audio API**: Dynamic sound generation
- **Local Storage**: Data persistence

### Project Structure

```
keymystery/
├── index.html          # Main HTML file
├── styles/
│   └── main.css        # All CSS styles and themes
├── js/
│   ├── game.js         # Core game logic and mechanics
│   ├── ui.js           # User interface management
│   ├── audio.js        # Audio system and sound effects
│   └── storage.js      # Data persistence and settings
├── sounds/             # Audio files (placeholder)
└── README.md          # This file
```

### Key Components

#### Game Engine (`game.js`)
- Randomized key mapping generation
- Word list management for different difficulties
- Game state management and progression
- Scoring and achievement systems

#### UI System (`ui.js`)
- Screen navigation and transitions
- Modal and notification systems
- Responsive design handling
- Progress tracking visualization

#### Audio Manager (`audio.js`)
- Procedural sound generation
- Dynamic audio effects
- Theme-based sound systems
- Audio visualization capabilities

#### Storage Manager (`storage.js`)
- Settings persistence
- Statistics tracking
- Session management
- Data export/import functionality

## 🎨 Customization

### Themes

KeyMystery comes with multiple visual themes:

- **Cosmic** (Default): Dark space theme with blue/cyan accents
- **Neon**: Cyberpunk-inspired with bright neon colors
- **Minimal**: Clean, minimalist design

### Settings

Customize your experience:

- **Audio**: Toggle sound effects and background music
- **Gameplay**: Show/hide virtual keyboard, adjust mapping display duration
- **Appearance**: Choose your preferred theme
- **Data**: Export/import game data, reset progress

## 📊 Statistics & Achievements

### Tracked Statistics

- Games played and highest score
- Average accuracy and total words typed
- Time played and mode-specific stats
- Daily progress tracking

### Achievement System

Unlock achievements by:
- Playing your first game
- Achieving perfect accuracy
- Completing multiple games in different modes
- Reaching high scores and word counts

## 🔧 Development

### Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. Make changes to HTML, CSS, or JavaScript files
4. Refresh the browser to see changes

### Adding New Features

The modular structure makes it easy to extend:

- **New Game Modes**: Add to `WORD_LISTS` and game logic in `game.js`
- **New Themes**: Add theme definitions in `storage.js` and CSS variables
- **New Sounds**: Extend the audio system in `audio.js`
- **New Achievements**: Add to the `ACHIEVEMENTS` array in `game.js`

### Contributing

Contributions are welcome! Areas for improvement:

- Additional game modes
- Enhanced visual effects
- Mobile app conversion
- Multiplayer functionality
- Advanced statistics
- More language support

## 📱 Mobile Support

KeyMystery is fully responsive and works on mobile devices:

- Touch-friendly virtual keyboard
- Adaptive layout for small screens
- Gesture support for navigation
- Optimized performance for mobile browsers

## 🔊 Audio Features

- **Procedural Audio**: All sounds generated dynamically using Web Audio API
- **Theme-Based Sounds**: Different audio styles for each theme
- **Adaptive Feedback**: Different sounds for correct/incorrect keystrokes
- **Ambient Effects**: Subtle background audio for immersion

## 💾 Data Management

- **Local Storage**: All data stored locally in your browser
- **Export/Import**: Backup and restore your progress
- **Privacy**: No data sent to external servers
- **Automatic Cleanup**: Old data automatically cleaned up

## 🎓 Educational Benefits

KeyMystery helps improve:

- **Memory**: Remembering key mappings enhances working memory
- **Adaptability**: Learning new layouts improves cognitive flexibility
- **Pattern Recognition**: Identifying patterns in randomized layouts
- **Focus**: Sustained attention during challenging gameplay
- **Problem Solving**: Developing strategies for different game modes

## 🚀 Future Enhancements

Planned features:

- **Daily Challenges**: New challenges every day
- **Global Leaderboards**: Compare scores with other players
- **Custom Mapping**: Create your own key mappings
- **Training Mode**: Practice specific skills
- **Accessibility**: Enhanced support for screen readers
- **Progressive Web App**: Install as a desktop/mobile app

## 🐛 Troubleshooting

### Common Issues

**Audio not working:**
- Ensure browser allows audio playback
- Check if device is muted
- Try clicking anywhere on the page first (browser requirement)

**Settings not saving:**
- Check if browser allows local storage
- Clear browser cache if needed
- Ensure sufficient storage space

**Game running slowly:**
- Close other browser tabs
- Disable browser extensions
- Check device performance

### Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

For questions, suggestions, or bug reports:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

## 🎉 Credits

Created with passion for cognitive training and gaming innovation.

**KeyMystery** - Unlock Your Mind's Potential!

---

*Ready to challenge your brain? Open `index.html` and start your KeyMystery adventure!*
