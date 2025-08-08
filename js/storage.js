// Local storage management for KeyMystery game data

// Default settings
const DEFAULT_SETTINGS = {
    soundEffects: true,
    backgroundMusic: false,
    showKeyboard: true,
    mappingDuration: 8, // seconds
    theme: 'cosmic',
    volume: 0.5
};

// Default statistics
const DEFAULT_STATS = {
    gamesPlayed: 0,
    highestScore: 0,
    totalWordsTyped: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    averageAccuracy: 0,
    totalPlayTime: 0, // in seconds
    achievements: [],
    gameModeStats: {
        'word-typing': { played: 0, highScore: 0, totalWords: 0 },
        'memory-recall': { played: 0, highScore: 0, totalWords: 0 },
        'speed-challenge': { played: 0, highScore: 0, totalWords: 0 },
        'pattern-match': { played: 0, highScore: 0, totalWords: 0 }
    },
    dailyStats: {},
    levelProgress: {
        'word-typing': 1,
        'memory-recall': 1,
        'speed-challenge': 1,
        'pattern-match': 1
    },
    bestStreak: 0,
    perfectAccuracyGames: 0,
    maxWordsInGame: 0,
    memoryRecallGames: 0,
    fastestWordTime: 999999,
    longestSession: 0
};

// Storage keys
const STORAGE_KEYS = {
    SETTINGS: 'keymystery-settings',
    STATS: 'keymystery-stats',
    GAME_SESSION: 'keymystery-session',
    DAILY_CHALLENGE: 'keymystery-daily'
};

// Settings management
function getSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (saved) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.warn('Failed to load settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings = null) {
    try {
        const currentSettings = settings || getCurrentSettingsFromUI();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(currentSettings));
        applySettings(currentSettings);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

function getCurrentSettingsFromUI() {
    return {
        soundEffects: document.getElementById('sound-effects')?.checked ?? DEFAULT_SETTINGS.soundEffects,
        backgroundMusic: document.getElementById('background-music')?.checked ?? DEFAULT_SETTINGS.backgroundMusic,
        showKeyboard: document.getElementById('show-keyboard')?.checked ?? DEFAULT_SETTINGS.showKeyboard,
        mappingDuration: parseInt(document.getElementById('mapping-duration')?.value ?? DEFAULT_SETTINGS.mappingDuration),
        theme: document.getElementById('theme-select')?.value ?? DEFAULT_SETTINGS.theme,
        volume: parseFloat(document.getElementById('volume')?.value ?? DEFAULT_SETTINGS.volume)
    };
}

function loadSettings() {
    const settings = getSettings();
    
    // Update UI elements
    const soundEffectsEl = document.getElementById('sound-effects');
    const backgroundMusicEl = document.getElementById('background-music');
    const showKeyboardEl = document.getElementById('show-keyboard');
    const mappingDurationEl = document.getElementById('mapping-duration');
    const mappingDurationValueEl = document.getElementById('mapping-duration-value');
    const themeSelectEl = document.getElementById('theme-select');
    
    if (soundEffectsEl) soundEffectsEl.checked = settings.soundEffects;
    if (backgroundMusicEl) backgroundMusicEl.checked = settings.backgroundMusic;
    if (showKeyboardEl) showKeyboardEl.checked = settings.showKeyboard;
    if (mappingDurationEl) mappingDurationEl.value = settings.mappingDuration;
    if (mappingDurationValueEl) mappingDurationValueEl.textContent = settings.mappingDuration;
    if (themeSelectEl) themeSelectEl.value = settings.theme;
    
    applySettings(settings);
}

function applySettings(settings) {
    // Apply theme
    applyTheme(settings.theme);
    
    // Apply keyboard visibility
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    if (virtualKeyboard) {
        virtualKeyboard.style.display = settings.showKeyboard ? 'block' : 'none';
    }
    
    // Apply audio settings
    if (window.Audio && window.Audio.audioManager) {
        window.Audio.audioManager.setEnabled(settings.soundEffects);
        window.Audio.audioManager.setVolume(settings.volume);
        window.Audio.updateAudioSettings();
    }
}

function applyTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    
    // Theme-specific CSS variables
    const themes = {
        cosmic: {
            '--primary-bg': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%)',
            '--accent-primary': '#00d4ff',
            '--accent-secondary': '#ff6b6b',
            '--accent-tertiary': '#4ecdc4'
        },
        neon: {
            '--primary-bg': 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #2a0a2a 100%)',
            '--accent-primary': '#ff0080',
            '--accent-secondary': '#00ff80',
            '--accent-tertiary': '#8000ff'
        },
        minimal: {
            '--primary-bg': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #3a3a3a 100%)',
            '--accent-primary': '#ffffff',
            '--accent-secondary': '#cccccc',
            '--accent-tertiary': '#999999'
        }
    };
    
    const themeVars = themes[themeName] || themes.cosmic;
    Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
    
    // Apply sound theme
    if (window.Audio && window.Audio.applySoundTheme) {
        window.Audio.applySoundTheme(themeName);
    }
}

// Statistics management
function getStats() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.STATS);
        if (saved) {
            return { ...DEFAULT_STATS, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.warn('Failed to load stats:', error);
    }
    return { ...DEFAULT_STATS };
}

function saveStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
        console.error('Failed to save stats:', error);
    }
}

function updateStats(gameData) {
    const stats = getStats();
    const today = new Date().toISOString().split('T')[0];
    
    // Update basic stats
    stats.gamesPlayed++;
    stats.highestScore = Math.max(stats.highestScore, gameData.score);
    stats.totalWordsTyped += gameData.wordsCompleted;
    stats.totalKeystrokes += gameData.totalKeystrokes || 0;
    stats.correctKeystrokes += gameData.correctKeystrokes || 0;
    stats.totalPlayTime += gameData.timePlayerd || 0;
    
    // Calculate accuracy
    stats.averageAccuracy = stats.totalKeystrokes > 0 ? 
        Math.round((stats.correctKeystrokes / stats.totalKeystrokes) * 100) : 0;
    
    // Update game mode stats
    if (stats.gameModeStats[gameData.mode]) {
        const modeStats = stats.gameModeStats[gameData.mode];
        modeStats.played++;
        modeStats.highScore = Math.max(modeStats.highScore, gameData.score);
        modeStats.totalWords += gameData.wordsCompleted;
    }
    
    // Update daily stats
    if (!stats.dailyStats[today]) {
        stats.dailyStats[today] = { games: 0, score: 0, words: 0 };
    }
    stats.dailyStats[today].games++;
    stats.dailyStats[today].score += gameData.score;
    stats.dailyStats[today].words += gameData.wordsCompleted;
    
    // Special achievements tracking
    if (gameData.accuracy === 100) {
        stats.perfectAccuracyGames++;
    }
    
    stats.maxWordsInGame = Math.max(stats.maxWordsInGame, gameData.wordsCompleted);
    
    if (gameData.mode === 'memory-recall') {
        stats.memoryRecallGames++;
    }
    
    // Track longest session
    stats.longestSession = Math.max(stats.longestSession, gameData.timePlayerd || 0);
    
    // Check for new achievements
    const newAchievements = checkAchievements(stats);
    if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
            showNotification(`Achievement Unlocked: ${achievement.name}!`, 'success', 5000);
        });
    }
    
    saveStats(stats);
    return stats;
}

function saveGameStats(gameData) {
    return updateStats(gameData);
}

// Session management
function saveGameSession(sessionData) {
    try {
        localStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify({
            ...sessionData,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Failed to save session:', error);
    }
}

function loadGameSession() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_SESSION);
        if (saved) {
            const session = JSON.parse(saved);
            // Check if session is not too old (1 hour)
            if (Date.now() - session.timestamp < 3600000) {
                return session;
            }
        }
    } catch (error) {
        console.warn('Failed to load session:', error);
    }
    return null;
}

function clearGameSession() {
    try {
        localStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
}

// Daily challenge system
function getDailyChallenge() {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date === today) {
                return data.challenge;
            }
        }
    } catch (error) {
        console.warn('Failed to load daily challenge:', error);
    }
    
    // Generate new daily challenge
    const challenge = generateDailyChallenge(today);
    saveDailyChallenge(today, challenge);
    return challenge;
}

function generateDailyChallenge(date) {
    // Use date as seed for consistent daily challenges
    const seed = date.split('-').reduce((sum, part) => sum + parseInt(part), 0);
    const random = () => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    
    const modes = ['word-typing', 'memory-recall', 'speed-challenge', 'pattern-match'];
    const difficulties = ['easy', 'medium', 'hard'];
    
    return {
        mode: modes[Math.floor(random() * modes.length)],
        difficulty: difficulties[Math.floor(random() * difficulties.length)],
        targetScore: 500 + Math.floor(random() * 1000),
        targetWords: 10 + Math.floor(random() * 20),
        targetAccuracy: 80 + Math.floor(random() * 20),
        reward: Math.floor(100 + random() * 200) // Bonus points
    };
}

function saveDailyChallenge(date, challenge) {
    try {
        localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify({
            date,
            challenge,
            completed: false
        }));
    } catch (error) {
        console.error('Failed to save daily challenge:', error);
    }
}

function completeDailyChallenge(gameData) {
    const dailyChallenge = getDailyChallenge();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if challenge requirements are met
    const scoreReached = gameData.score >= dailyChallenge.targetScore;
    const wordsReached = gameData.wordsCompleted >= dailyChallenge.targetWords;
    const accuracyReached = gameData.accuracy >= dailyChallenge.targetAccuracy;
    
    if (scoreReached && wordsReached && accuracyReached) {
        // Mark as completed and award bonus
        saveDailyChallenge(today, { ...dailyChallenge, completed: true });
        showNotification(`Daily Challenge Completed! +${dailyChallenge.reward} bonus points`, 'success', 5000);
        return dailyChallenge.reward;
    }
    
    return 0;
}

// Data export/import utilities
function exportAllData() {
    return {
        settings: getSettings(),
        stats: getStats(),
        session: loadGameSession(),
        dailyChallenge: getDailyChallenge(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
}

function importAllData(data) {
    try {
        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        if (data.stats) {
            localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
        }
        if (data.session) {
            localStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(data.session));
        }
        if (data.dailyChallenge) {
            const today = new Date().toISOString().split('T')[0];
            saveDailyChallenge(today, data.dailyChallenge);
        }
        
        // Reload settings and stats
        loadSettings();
        updateStatsDisplay();
        
        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}

// Storage cleanup utilities
function cleanupOldData() {
    const stats = getStats();
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // Keep 6 months of daily stats
    
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    // Remove old daily stats
    Object.keys(stats.dailyStats).forEach(date => {
        if (date < cutoffString) {
            delete stats.dailyStats[date];
        }
    });
    
    saveStats(stats);
}

function getStorageUsage() {
    let total = 0;
    const usage = {};
    
    Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
            const size = new Blob([item]).size;
            usage[key] = size;
            total += size;
        }
    });
    
    return { total, breakdown: usage };
}

// Data validation
function validateStats(stats) {
    // Ensure all required fields exist
    const validStats = { ...DEFAULT_STATS };
    
    if (stats && typeof stats === 'object') {
        // Copy valid numeric fields
        ['gamesPlayed', 'highestScore', 'totalWordsTyped', 'totalKeystrokes', 
         'correctKeystrokes', 'averageAccuracy', 'totalPlayTime', 'bestStreak',
         'perfectAccuracyGames', 'maxWordsInGame', 'memoryRecallGames',
         'fastestWordTime', 'longestSession'].forEach(field => {
            if (typeof stats[field] === 'number' && !isNaN(stats[field])) {
                validStats[field] = stats[field];
            }
        });
        
        // Copy arrays
        if (Array.isArray(stats.achievements)) {
            validStats.achievements = stats.achievements;
        }
        
        // Copy objects
        if (stats.gameModeStats && typeof stats.gameModeStats === 'object') {
            validStats.gameModeStats = { ...DEFAULT_STATS.gameModeStats, ...stats.gameModeStats };
        }
        
        if (stats.dailyStats && typeof stats.dailyStats === 'object') {
            validStats.dailyStats = stats.dailyStats;
        }
        
        if (stats.levelProgress && typeof stats.levelProgress === 'object') {
            validStats.levelProgress = { ...DEFAULT_STATS.levelProgress, ...stats.levelProgress };
        }
    }
    
    return validStats;
}

function validateSettings(settings) {
    const validSettings = { ...DEFAULT_SETTINGS };
    
    if (settings && typeof settings === 'object') {
        // Boolean fields
        ['soundEffects', 'backgroundMusic', 'showKeyboard'].forEach(field => {
            if (typeof settings[field] === 'boolean') {
                validSettings[field] = settings[field];
            }
        });
        
        // Numeric fields with ranges
        if (typeof settings.mappingDuration === 'number' && 
            settings.mappingDuration >= 3 && settings.mappingDuration <= 15) {
            validSettings.mappingDuration = settings.mappingDuration;
        }
        
        if (typeof settings.volume === 'number' && 
            settings.volume >= 0 && settings.volume <= 1) {
            validSettings.volume = settings.volume;
        }
        
        // String fields with allowed values
        if (typeof settings.theme === 'string' && 
            ['cosmic', 'neon', 'minimal'].includes(settings.theme)) {
            validSettings.theme = settings.theme;
        }
    }
    
    return validSettings;
}

// Initialize storage on load
document.addEventListener('DOMContentLoaded', () => {
    // Load and apply settings
    loadSettings();
    
    // Clean up old data periodically
    const lastCleanup = localStorage.getItem('last-cleanup');
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (!lastCleanup || Date.now() - parseInt(lastCleanup) > oneWeek) {
        cleanupOldData();
        localStorage.setItem('last-cleanup', Date.now().toString());
    }
});

// Export storage functions
window.Storage = {
    getSettings,
    saveSettings,
    loadSettings,
    applySettings,
    getStats,
    saveStats,
    updateStats,
    saveGameStats,
    saveGameSession,
    loadGameSession,
    clearGameSession,
    getDailyChallenge,
    completeDailyChallenge,
    exportAllData,
    importAllData,
    cleanupOldData,
    getStorageUsage,
    validateStats,
    validateSettings
};
