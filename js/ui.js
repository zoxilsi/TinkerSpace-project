// UI state management and navigation

let currentScreen = 'main-menu';

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Update game state
        if (window.GameEngine && window.GameEngine.gameState) {
            window.GameEngine.gameState.currentScreen = screenId;
        }
        
        // Perform screen-specific actions
        switch (screenId) {
            case 'stats':
                updateStatsDisplay();
                displayAchievements();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
}

function showMainMenu() {
    showScreen('main-menu');
}

function showGameModeSelector() {
    showScreen('game-mode-selector');
}

function showInstructions() {
    showScreen('instructions');
}

function showStats() {
    showScreen('stats');
    updateStatsDisplay();
    displayAchievements();
}

function showSettings() {
    showScreen('settings');
}

function updateStatsDisplay() {
    const stats = getStats();
    
    // Update stat cards
    document.getElementById('total-games').textContent = stats.gamesPlayed;
    document.getElementById('highest-score').textContent = stats.highestScore;
    document.getElementById('avg-accuracy').textContent = stats.averageAccuracy + '%';
    document.getElementById('total-words').textContent = stats.totalWordsTyped;
}

// Animation utilities
function addPulseAnimation(element) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, 1000);
}

function addFadeOutAnimation(element, callback) {
    element.classList.add('fade-out');
    setTimeout(() => {
        if (callback) callback();
        element.classList.remove('fade-out');
    }, 500);
}

// Toast notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-bg);
        border: 1px solid var(--accent-primary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        color: var(--text-primary);
        backdrop-filter: blur(10px);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Add type-specific styling
    switch (type) {
        case 'success':
            notification.style.borderColor = 'var(--success-color)';
            break;
        case 'error':
            notification.style.borderColor = 'var(--error-color)';
            break;
        case 'warning':
            notification.style.borderColor = 'var(--warning-color)';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

function closeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Progress tracking UI
function showProgress(current, total, label = 'Progress') {
    const progressBar = document.getElementById('progress-bar') || createProgressBar();
    const percentage = Math.round((current / total) * 100);
    
    progressBar.querySelector('.progress-fill').style.width = percentage + '%';
    progressBar.querySelector('.progress-label').textContent = `${label}: ${current}/${total}`;
    progressBar.querySelector('.progress-percentage').textContent = percentage + '%';
    
    progressBar.style.display = 'block';
}

function hideProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.display = 'none';
    }
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.innerHTML = `
        <div class="progress-header">
            <span class="progress-label">Progress</span>
            <span class="progress-percentage">0%</span>
        </div>
        <div class="progress-track">
            <div class="progress-fill"></div>
        </div>
    `;
    
    progressBar.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: var(--secondary-bg);
        border: 1px solid var(--accent-primary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        backdrop-filter: blur(10px);
        z-index: 999;
        display: none;
    `;
    
    document.body.appendChild(progressBar);
    return progressBar;
}

// Modal system
function showModal(title, content, buttons = []) {
    // Remove existing modal
    const existingModal = document.getElementById('modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: var(--secondary-bg);
        border: 1px solid var(--accent-primary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-lg);
        animation: modalSlideIn 0.3s ease-out;
    `;
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    modalTitle.style.cssText = `
        font-family: var(--font-primary);
        color: var(--accent-primary);
        margin: 0;
        font-size: 1.5rem;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeButton.onclick = closeModal;
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.innerHTML = content;
    modalBody.style.cssText = `
        color: var(--text-primary);
        line-height: 1.6;
        margin-bottom: var(--spacing-lg);
    `;
    
    // Create modal footer
    const modalFooter = document.createElement('div');
    modalFooter.style.cssText = `
        display: flex;
        gap: var(--spacing-md);
        justify-content: flex-end;
    `;
    
    // Add buttons
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.text;
        btn.className = button.primary ? 'menu-btn primary' : 'menu-btn';
        btn.onclick = () => {
            if (button.onClick) button.onClick();
            closeModal();
        };
        modalFooter.appendChild(btn);
    });
    
    // Default close button if no buttons provided
    if (buttons.length === 0) {
        const defaultButton = document.createElement('button');
        defaultButton.textContent = 'Close';
        defaultButton.className = 'menu-btn primary';
        defaultButton.onclick = closeModal;
        modalFooter.appendChild(defaultButton);
    }
    
    // Assemble modal
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modal.appendChild(modalFooter);
    modalOverlay.appendChild(modal);
    
    // Add to DOM
    document.body.appendChild(modalOverlay);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', handleModalEscape);
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.style.animation = 'modalSlideOut 0.3s ease-out';
        setTimeout(() => {
            modalOverlay.remove();
            document.removeEventListener('keydown', handleModalEscape);
        }, 300);
    }
}

function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Confirmation dialog
function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    showModal(title, message, [
        {
            text: 'Cancel',
            primary: false,
            onClick: onCancel
        },
        {
            text: 'Confirm',
            primary: true,
            onClick: onConfirm
        }
    ]);
}

// Loading overlay
function showLoading(message = 'Loading...') {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
    `;
    
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
    `;
    
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Game-specific UI functions
function resetAllData() {
    showConfirmDialog(
        'Reset All Data',
        'This will permanently delete all your game progress, statistics, and settings. This action cannot be undone.',
        () => {
            // Clear all localStorage data
            localStorage.clear();
            
            // Reset current session
            if (window.GameEngine && window.GameEngine.gameState) {
                window.GameEngine.gameState.reset();
            }
            
            // Reset UI
            updateStatsDisplay();
            loadSettings();
            
            showNotification('All data has been reset', 'success');
            showMainMenu();
        }
    );
}

function exportGameData() {
    const gameData = {
        stats: getStats(),
        settings: getSettings(),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'keymystery-data.json';
    link.click();
    
    showNotification('Game data exported successfully', 'success');
}

function importGameData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const gameData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!gameData.stats || !gameData.settings) {
                    throw new Error('Invalid data format');
                }
                
                // Import data
                localStorage.setItem('keymystery-stats', JSON.stringify(gameData.stats));
                localStorage.setItem('keymystery-settings', JSON.stringify(gameData.settings));
                
                // Refresh UI
                updateStatsDisplay();
                loadSettings();
                
                showNotification('Game data imported successfully', 'success');
            } catch (error) {
                showNotification('Failed to import data: Invalid file format', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when not in game
    if (currentScreen === 'game-screen') return;
    
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'h':
                e.preventDefault();
                showMainMenu();
                break;
            case 's':
                e.preventDefault();
                showStats();
                break;
            case ',':
                e.preventDefault();
                showSettings();
                break;
            case 'i':
                e.preventDefault();
                showInstructions();
                break;
        }
    }
    
    // Escape key handling
    if (e.key === 'Escape') {
        if (currentScreen !== 'main-menu') {
            showMainMenu();
        }
    }
});

// Responsive design helpers
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function updateResponsiveElements() {
    // Adjust virtual keyboard for mobile
    if (isMobile()) {
        const virtualKeyboard = document.getElementById('virtual-keyboard');
        if (virtualKeyboard) {
            virtualKeyboard.style.padding = 'var(--spacing-sm)';
        }
        
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.style.minWidth = '35px';
            key.style.height = '35px';
            key.style.fontSize = '0.8rem';
        });
    }
}

// Initialize responsive handling
window.addEventListener('resize', updateResponsiveElements);
document.addEventListener('DOMContentLoaded', updateResponsiveElements);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(300px);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes modalSlideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 212, 255, 0.3);
        border-top: 3px solid var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: var(--spacing-md);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-message {
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);
    }
    
    .progress-track {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
        transition: width 0.3s ease;
        border-radius: 4px;
    }
    
    .progress-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .progress-percentage {
        color: var(--accent-primary);
        font-weight: 600;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);

// Export UI functions
window.UI = {
    showScreen,
    showMainMenu,
    showGameModeSelector,
    showInstructions,
    showStats,
    showSettings,
    showNotification,
    showModal,
    showConfirmDialog,
    showLoading,
    hideLoading,
    resetAllData,
    exportGameData,
    importGameData
};
