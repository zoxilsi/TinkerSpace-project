// Audio system for KeyMystery game

class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.audioContext = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Create audio context for modern browsers
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            
            // Generate sounds programmatically since we don't have audio files
            this.generateSounds();
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.enabled = false;
        }
    }

    generateSounds() {
        // Generate different tones for different game events
        this.sounds = {
            key: this.createTone(800, 0.1, 'sine'),
            success: this.createChord([523, 659, 784], 0.3), // C major chord
            error: this.createTone(200, 0.2, 'square'),
            levelUp: this.createMelody([523, 659, 784, 1047], 0.15),
            gameStart: this.createTone(440, 0.5, 'sine'),
            gameEnd: this.createMelody([1047, 784, 659, 523], 0.2)
        };
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled || !this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createChord(frequencies, duration) {
        return () => {
            if (!this.enabled || !this.audioContext) return;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    const volume = this.volume * 0.2; // Lower volume for chords
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 50); // Slight delay between notes
            });
        };
    }

    createMelody(frequencies, noteDuration) {
        return () => {
            if (!this.enabled || !this.audioContext) return;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + noteDuration * 0.8);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + noteDuration);
                }, index * noteDuration * 1000); // Convert to milliseconds
            });
        };
    }

    async playSound(soundName) {
        if (!this.enabled) return;

        // Initialize on first interaction (required by browsers)
        if (!this.initialized) {
            await this.initialize();
        }

        // Resume audio context if it's suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        const sound = this.sounds[soundName];
        if (sound) {
            try {
                sound();
            } catch (error) {
                console.warn('Sound playback failed:', error);
            }
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.audioContext) {
            this.audioContext.suspend();
        } else if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Play ambient background sounds
    startAmbientLoop() {
        if (!this.enabled || !this.audioContext) return;

        const playAmbient = () => {
            if (!this.enabled) return;

            // Create subtle ambient tone
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Very subtle ambient frequency
            oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
            
            const ambientVolume = this.volume * 0.05; // Very quiet
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(ambientVolume, this.audioContext.currentTime + 2);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 8);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 8);
            
            // Schedule next ambient sound
            setTimeout(playAmbient, 10000 + Math.random() * 5000); // 10-15 seconds
        };

        playAmbient();
    }

    // Create typing rhythm sounds
    playTypingRhythm(speed = 1) {
        if (!this.enabled || !this.audioContext) return;

        const interval = (60 / 120) * (1 / speed) * 1000; // 120 BPM base rhythm
        let count = 0;

        const playBeat = () => {
            if (count >= 8) return; // Play 8 beats

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Alternating high and low tones
            const frequency = count % 2 === 0 ? 880 : 660;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'square';
            
            const beatVolume = this.volume * 0.1;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(beatVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
            count++;
            setTimeout(playBeat, interval);
        };

        playBeat();
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Convenience function for playing sounds
function playSound(soundName) {
    audioManager.playSound(soundName);
}

// Initialize audio on first user interaction
document.addEventListener('click', () => {
    audioManager.initialize();
}, { once: true });

document.addEventListener('keydown', () => {
    audioManager.initialize();
}, { once: true });

// Audio settings management
function updateAudioSettings() {
    const soundEffectsEnabled = document.getElementById('sound-effects')?.checked ?? true;
    const backgroundMusicEnabled = document.getElementById('background-music')?.checked ?? false;
    
    audioManager.setEnabled(soundEffectsEnabled);
    
    if (backgroundMusicEnabled) {
        audioManager.startAmbientLoop();
    }
}

// Audio visualization
class AudioVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.analyser = null;
        this.dataArray = null;
        this.isRunning = false;
    }

    initialize(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || !audioManager.audioContext) return false;

        this.ctx = this.canvas.getContext('2d');
        this.analyser = audioManager.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        return true;
    }

    start() {
        if (!this.analyser || this.isRunning) return;
        
        this.isRunning = true;
        this.draw();
    }

    stop() {
        this.isRunning = false;
    }

    draw() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.draw());

        this.analyser.getByteFrequencyData(this.dataArray);

        this.ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = this.dataArray[i] / 255 * this.canvas.height * 0.7;

            // Create gradient for bars
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height - barHeight, 0, this.canvas.height);
            gradient.addColorStop(0, '#00d4ff');
            gradient.addColorStop(1, '#4ecdc4');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}

// Game-specific audio events
function onGameStart(gameMode) {
    playSound('gameStart');
    
    if (gameMode === 'speed-challenge') {
        audioManager.playTypingRhythm(1.5);
    }
}

function onWordComplete() {
    playSound('success');
}

function onGameComplete() {
    playSound('gameEnd');
}

function onLevelUp() {
    playSound('levelUp');
}

function onKeyPress(isCorrect) {
    if (isCorrect) {
        playSound('key');
    } else {
        playSound('error');
    }
}

// Advanced audio effects
class AudioEffects {
    constructor(audioContext) {
        this.audioContext = audioContext;
    }

    createReverb(duration = 2) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        const convolver = this.audioContext.createConvolver();
        convolver.buffer = impulse;
        return convolver;
    }

    createDelay(delayTime = 0.3, feedback = 0.4) {
        const delay = this.audioContext.createDelay();
        const delayFeedback = this.audioContext.createGain();
        const delayVolume = this.audioContext.createGain();
        
        delay.delayTime.value = delayTime;
        delayFeedback.gain.value = feedback;
        delayVolume.gain.value = 0.3;
        
        delay.connect(delayFeedback);
        delayFeedback.connect(delay);
        delay.connect(delayVolume);
        
        return { input: delay, output: delayVolume };
    }

    createFilter(type = 'lowpass', frequency = 1000) {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = type;
        filter.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        return filter;
    }
}

// Sound presets for different themes
const SOUND_THEMES = {
    cosmic: {
        key: { frequency: 800, type: 'sine' },
        success: { frequencies: [523, 659, 784] },
        error: { frequency: 200, type: 'square' }
    },
    neon: {
        key: { frequency: 1000, type: 'sawtooth' },
        success: { frequencies: [440, 554, 659] },
        error: { frequency: 150, type: 'triangle' }
    },
    minimal: {
        key: { frequency: 600, type: 'sine' },
        success: { frequencies: [500, 600, 750] },
        error: { frequency: 300, type: 'sine' }
    }
};

function applySoundTheme(theme) {
    if (SOUND_THEMES[theme]) {
        // Regenerate sounds with new theme
        audioManager.generateSounds();
    }
}

// Export audio functions
window.Audio = {
    audioManager,
    playSound,
    onGameStart,
    onWordComplete,
    onGameComplete,
    onLevelUp,
    onKeyPress,
    updateAudioSettings,
    applySoundTheme,
    AudioVisualizer
};
