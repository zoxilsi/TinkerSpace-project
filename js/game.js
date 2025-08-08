// Game state management
class GameState {
    constructor() {
        this.currentScreen = 'main-menu';
        this.gameMode = null;
        this.difficulty = 'easy';
        this.keyMapping = {};
        this.originalMapping = {};
        this.currentWord = '';
        this.currentInput = '';
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 60;
        this.wordsCompleted = 0;
        this.totalKeystrokes = 0;
        this.correctKeystrokes = 0;
        this.gameTimer = null;
        this.gameStartTime = null;
        this.isPaused = false;
        this.showMappings = true;
    }

    reset() {
        this.currentWord = '';
        this.currentInput = '';
        this.score = 0;
        this.level = 1;
        this.timeRemaining = 60;
        this.wordsCompleted = 0;
        this.totalKeystrokes = 0;
        this.correctKeystrokes = 0;
        this.gameStartTime = null;
        this.isPaused = false;
        this.showMappings = true;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
}

// Word lists for different game modes
const WORD_LISTS = {
    easy: [
        'HELLO', 'WORLD', 'GAME', 'PLAY', 'KEY', 'TYPE', 'WORD', 'CODE',
        'MIND', 'BRAIN', 'LEARN', 'SKILL', 'FOCUS', 'SPEED', 'QUICK', 'SMART'
    ],
    medium: [
        'CHALLENGE', 'MYSTERY', 'KEYBOARD', 'PATTERN', 'MEMORY', 'TYPING',
        'PRACTICE', 'IMPROVE', 'DEVELOP', 'MASTER', 'PERFECT', 'EXPERT',
        'ADVANCED', 'COMPLEX', 'DIFFICULT', 'TRAINING'
    ],
    hard: [
        'EXTRAORDINARY', 'UNPRECEDENTED', 'SOPHISTICATED', 'REVOLUTIONARY',
        'MAGNIFICENT', 'SPECTACULAR', 'PHENOMENAL', 'EXCEPTIONAL',
        'INCOMPREHENSIBLE', 'MULTIDIMENSIONAL', 'TRANSFORMATION',
        'ACCOMPLISHMENT', 'DETERMINATION', 'PERSEVERANCE', 'EXCELLENCE'
    ]
};

const PATTERNS = {
    sequences: ['ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRST', 'UVWX', 'YZ'],
    palindromes: ['ABA', 'ABBA', 'ABCBA', 'RADAR', 'LEVEL', 'CIVIC'],
    repeating: ['AABB', 'ABAB', 'AAAA', 'ABCD', 'XYZX']
};

// Initialize game state
const gameState = new GameState();

// Keyboard layout for mapping
const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// Utility functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Key mapping functions
function generateKeyMapping() {
    const allKeys = KEYBOARD_LAYOUT.flat();
    const shuffledKeys = shuffleArray(allKeys);
    
    gameState.keyMapping = {};
    gameState.originalMapping = {};
    
    allKeys.forEach((key, index) => {
        gameState.keyMapping[key.toLowerCase()] = shuffledKeys[index];
        gameState.originalMapping[shuffledKeys[index]] = key.toLowerCase();
    });
    
    // Always map space to space
    gameState.keyMapping[' '] = ' ';
    gameState.originalMapping[' '] = ' ';
}

function displayKeyMappings() {
    const mappingGrid = document.getElementById('mapping-grid');
    mappingGrid.innerHTML = '';

    // Render rows to mimic a QWERTY keyboard layout with offsets
    KEYBOARD_LAYOUT.forEach((rowKeys, index) => {
        const row = document.createElement('div');
        row.className = `mapping-row row-${index + 1}`;

        rowKeys.forEach(key => {
            const mappingItem = document.createElement('div');
            mappingItem.className = 'mapping-item';
            mappingItem.setAttribute('role', 'group');
            mappingItem.setAttribute('aria-label', `Key ${key} maps to ${gameState.keyMapping[key.toLowerCase()].toUpperCase()}`);

            mappingItem.innerHTML = `
                <div class="mapping-key">${key}</div>
                <div class="mapping-arrow">↓</div>
                <div class="mapping-value">${gameState.keyMapping[key.toLowerCase()].toUpperCase()}</div>
            `;

            row.appendChild(mappingItem);
        });

        mappingGrid.appendChild(row);
    });
}

function updateVirtualKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        const keyValue = key.dataset.key;
        if (keyValue && keyValue !== ' ') {
            const mappedValue = gameState.keyMapping[keyValue];
            key.innerHTML = `<span style="font-size: 0.8rem; opacity: 0.6;">${keyValue.toUpperCase()}</span><br>${mappedValue ? mappedValue.toUpperCase() : keyValue.toUpperCase()}`;
        }
    });
}

// Word generation functions
function getNextWord() {
    let wordList;
    
    switch (gameState.gameMode) {
        case 'word-typing':
            wordList = gameState.level <= 3 ? WORD_LISTS.easy : 
                      gameState.level <= 6 ? WORD_LISTS.medium : WORD_LISTS.hard;
            break;
        case 'memory-recall':
            wordList = gameState.level <= 2 ? WORD_LISTS.easy : WORD_LISTS.medium;
            break;
        case 'speed-challenge':
            wordList = WORD_LISTS.easy.concat(WORD_LISTS.medium);
            break;
        case 'pattern-match':
            if (gameState.level <= 2) {
                return getRandomElement(PATTERNS.sequences);
            } else if (gameState.level <= 4) {
                return getRandomElement(PATTERNS.palindromes);
            } else {
                return getRandomElement(PATTERNS.repeating);
            }
        default:
            wordList = WORD_LISTS.easy;
    }
    
    return getRandomElement(wordList);
}

// Game logic functions
function startGame(mode) {
    gameState.gameMode = mode;
    gameState.reset();
    gameState.gameMode = mode; // Reset clears this, so set it again
    
    generateKeyMapping();
    displayKeyMappings();
    updateVirtualKeyboard();
    
    gameState.currentWord = getNextWord();
    gameState.gameStartTime = Date.now();
    
    // Set initial time based on game mode
    switch (mode) {
        case 'word-typing':
            gameState.timeRemaining = 90;
            break;
        case 'memory-recall':
            gameState.timeRemaining = 120;
            break;
        case 'speed-challenge':
            gameState.timeRemaining = 60;
            break;
        case 'pattern-match':
            gameState.timeRemaining = 75;
            break;
        default:
            gameState.timeRemaining = 60;
    }
    
    updateGameDisplay();
    showScreen('game-screen');
    startGameTimer();
    
    // Hide mappings after some time for certain modes
    if (mode === 'memory-recall' || mode === 'speed-challenge') {
        setTimeout(() => {
            if (gameState.showMappings) {
                toggleMappings();
            }
        }, getSettings().mappingDuration * 1000);
    }
}

function startGameTimer() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    gameState.gameTimer = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.timeRemaining--;
            updateGameDisplay();
            
            if (gameState.timeRemaining <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function pauseGame() {
    gameState.isPaused = !gameState.isPaused;
    const pauseBtn = document.querySelector('.pause-btn');
    pauseBtn.textContent = gameState.isPaused ? '▶️' : '⏸️';
}

function endGame() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    const gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    const accuracy = gameState.totalKeystrokes > 0 ? 
        Math.round((gameState.correctKeystrokes / gameState.totalKeystrokes) * 100) : 0;
    
    // Update final stats
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('game-accuracy').textContent = accuracy + '%';
    document.getElementById('words-completed').textContent = gameState.wordsCompleted;
    document.getElementById('time-played').textContent = gameTime + 's';
    
    // Save stats to storage
    saveGameStats({
        mode: gameState.gameMode,
        score: gameState.score,
        accuracy: accuracy,
        wordsCompleted: gameState.wordsCompleted,
        timePlayerd: gameTime
    });
    
    showScreen('game-over');
    playSound('success');
}

function processKeyInput(key) {
    if (gameState.isPaused || !gameState.currentWord) return;
    
    const mappedKey = gameState.keyMapping[key.toLowerCase()];
    if (!mappedKey) return;
    
    gameState.totalKeystrokes++;
    
    const expectedChar = gameState.currentWord[gameState.currentInput.length];
    
    if (mappedKey.toUpperCase() === expectedChar) {
        // Correct key
        gameState.currentInput += expectedChar;
        gameState.correctKeystrokes++;
        
        // Visual feedback
        showFeedback('Correct!', 'success');
        highlightKey(key);
        playSound('key');
        
        // Check if word is complete
        if (gameState.currentInput === gameState.currentWord) {
            completeWord();
        }
    } else {
        // Incorrect key
        showFeedback(`Expected: ${expectedChar}, Got: ${mappedKey.toUpperCase()}`, 'error');
        playSound('error');
        
        // In some modes, incorrect keys reset the word
        if (gameState.gameMode === 'memory-recall' || gameState.gameMode === 'speed-challenge') {
            gameState.currentInput = '';
        }
    }
    
    updateGameDisplay();
}

function completeWord() {
    gameState.wordsCompleted++;
    
    // Calculate points based on word length and speed
    let points = gameState.currentWord.length * 10;
    
    // Bonus points for accuracy and speed
    const accuracy = gameState.correctKeystrokes / gameState.totalKeystrokes;
    points += Math.floor(accuracy * 50);
    
    // Mode-specific bonuses
    switch (gameState.gameMode) {
        case 'memory-recall':
            points *= 1.5;
            break;
        case 'speed-challenge':
            points *= 1.3;
            break;
        case 'pattern-match':
            points *= 1.2;
            break;
    }
    
    gameState.score += Math.floor(points);
    
    // Level progression
    if (gameState.wordsCompleted % 5 === 0) {
        gameState.level++;
        
        // Regenerate mapping for higher levels
        if (gameState.gameMode === 'speed-challenge' || gameState.level % 3 === 0) {
            generateKeyMapping();
            displayKeyMappings();
            updateVirtualKeyboard();
            showFeedback('New mappings generated!', 'success');
        }
    }
    
    // Get next word
    gameState.currentWord = getNextWord();
    gameState.currentInput = '';
    
    showFeedback(`Word completed! +${Math.floor(points)} points`, 'success');
    
    // Add time bonus for certain modes
    if (gameState.gameMode === 'speed-challenge') {
        gameState.timeRemaining += 5;
    }
}

function showFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-message ${type}`;
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback-message';
    }, 2000);
}

function highlightKey(key) {
    const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, 200);
    }
}

function updateGameDisplay() {
    document.getElementById('current-score').textContent = gameState.score;
    document.getElementById('current-level').textContent = gameState.level;
    document.getElementById('timer').textContent = gameState.timeRemaining;
    document.getElementById('target-word').textContent = gameState.currentWord;
    
    // Update typed input display
    const typedInputElement = document.getElementById('typed-input');
    typedInputElement.innerHTML = '';
    
    for (let i = 0; i < gameState.currentWord.length; i++) {
        const span = document.createElement('span');
        span.textContent = i < gameState.currentInput.length ? 
            gameState.currentInput[i] : '_';
        
        if (i < gameState.currentInput.length) {
            span.style.color = 'var(--success-color)';
        } else if (i === gameState.currentInput.length) {
            span.style.color = 'var(--accent-primary)';
            span.style.textDecoration = 'underline';
        } else {
            span.style.color = 'var(--text-muted)';
        }
        
        typedInputElement.appendChild(span);
    }
}

function toggleMappings() {
    const mappingDisplay = document.getElementById('key-mapping-display');
    const toggleBtn = document.getElementById('hide-mappings-btn');
    
    gameState.showMappings = !gameState.showMappings;
    
    if (gameState.showMappings) {
        mappingDisplay.style.display = 'block';
        toggleBtn.textContent = 'Hide Mappings';
    } else {
        mappingDisplay.style.display = 'none';
        toggleBtn.textContent = 'Show Mappings';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Keyboard input listener
    document.addEventListener('keydown', function(event) {
        if (gameState.currentScreen === 'game-screen' && !gameState.isPaused) {
            event.preventDefault();
            processKeyInput(event.key);
        }
    });
    
    // Virtual keyboard click listeners
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            if (gameState.currentScreen === 'game-screen' && !gameState.isPaused) {
                processKeyInput(this.dataset.key);
            }
        });
    });
    
    // Settings change listeners
    const mappingDurationSlider = document.getElementById('mapping-duration');
    const mappingDurationValue = document.getElementById('mapping-duration-value');
    
    if (mappingDurationSlider && mappingDurationValue) {
        mappingDurationSlider.addEventListener('input', function() {
            mappingDurationValue.textContent = this.value;
            saveSettings();
        });
    }
    
    // Other setting change listeners
    document.querySelectorAll('#settings input, #settings select').forEach(input => {
        input.addEventListener('change', saveSettings);
    });
    
    // Load saved settings
    loadSettings();
    
    // Initialize stats display
    updateStatsDisplay();
});

// Achievement system
const ACHIEVEMENTS = [
    {
        id: 'first-game',
        name: 'First Steps',
        description: 'Complete your first game',
        icon: '🎮',
        condition: (stats) => stats.gamesPlayed >= 1
    },
    {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete 10 words in a single game',
        icon: '⚡',
        condition: (stats) => stats.maxWordsInGame >= 10
    },
    {
        id: 'perfect-accuracy',
        name: 'Perfect Precision',
        description: 'Achieve 100% accuracy in a game',
        icon: '🎯',
        condition: (stats) => stats.perfectAccuracyGames >= 1
    },
    {
        id: 'memory-master',
        name: 'Memory Master',
        description: 'Complete 5 Memory Recall games',
        icon: '🧠',
        condition: (stats) => stats.memoryRecallGames >= 5
    },
    {
        id: 'high-scorer',
        name: 'High Scorer',
        description: 'Reach a score of 1000 points',
        icon: '🏆',
        condition: (stats) => stats.highestScore >= 1000
    },
    {
        id: 'persistent',
        name: 'Persistent Player',
        description: 'Play 25 games',
        icon: '💪',
        condition: (stats) => stats.gamesPlayed >= 25
    }
];

function checkAchievements(stats) {
    const unlockedAchievements = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        if (achievement.condition(stats) && !stats.achievements.includes(achievement.id)) {
            stats.achievements.push(achievement.id);
            unlockedAchievements.push(achievement);
        }
    });
    
    return unlockedAchievements;
}

function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    const stats = getStats();
    
    achievementsList.innerHTML = '';
    
    ACHIEVEMENTS.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item ' + 
            (stats.achievements.includes(achievement.id) ? 'unlocked' : 'locked');
        
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        achievementsList.appendChild(achievementElement);
    });
}

// Export functions for use in other modules
window.GameEngine = {
    startGame,
    pauseGame,
    endGame,
    toggleMappings,
    gameState
};
