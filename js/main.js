/**
 * Main Game Entry Point
 * Initializes and runs the strategy game
 */

let gameState;
let ui;

/**
 * Initialize the game
 */
function initGame() {
    try {
        // Create game state
        gameState = new GameState();
        gameState.playingAgainstAI = true;
        gameState.aiPlayer = CONFIG.PLAYERS.PLAYER2;

        // Create UI
        ui = new UI(gameState, 'gameBoard');

        // Show setup modal
        document.getElementById('setupModal').classList.remove('hidden');

        console.log('Game initialized. Ready to start.');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

/**
 * Start game with selected setup
 */
function startGame(setupMode = 'standard') {
    gameState.initializeGame(setupMode);
    ui.updateUI();
    ui.render();
    console.log(`Game started with ${setupMode} setup`);
}

/**
 * Handle window resize for responsive canvas
 */
window.addEventListener('resize', () => {
    if (ui && ui.renderer) {
        ui.render();
    }
});

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Game error:', event.error);
});

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    if (!gameState || gameState.gameState !== CONFIG.GAME_STATE.PLAYING) return;

    switch (e.key.toLowerCase()) {
        case 'n':
            // New game
            document.getElementById('newGameBtn').click();
            break;
        case 'r':
            // Resign
            document.getElementById('resignBtn').click();
            break;
        case 'h':
            // History
            document.getElementById('historyBtn').click();
            break;
        case 's':
            // Settings
            document.getElementById('settingsBtn').click();
            break;
        case 'escape':
            // Close any open modal
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('hidden');
            });
            break;
    }
});

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already loaded
    initGame();
}
