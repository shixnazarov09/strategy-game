/**
 * UI Controller
 * Manages user interface and event handling
 */

class UI {
    constructor(gameState, canvasId = 'gameBoard') {
        this.gameState = gameState;
        this.renderer = new Renderer(canvasId, gameState.board, gameState.visionSystem);
        this.gameState.renderer = this.renderer; // Link renderer to game state
        this.selectedPiece = null;
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        const canvas = this.renderer.canvas;

        // Canvas events
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));

        // Button events
        document.getElementById('newGameBtn').addEventListener('click', () => this.handleNewGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.handleUndo());
        document.getElementById('resignBtn').addEventListener('click', () => this.handleResign());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistory());

        // Settings modal
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.hideSettings());
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistory());
        document.getElementById('closeHistoryBtn').addEventListener('click', () => this.hideHistory());

        // Setup modal
        const setupButtons = document.querySelectorAll('.setup-options button');
        setupButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSetupChoice(e));
        });

        // Settings changes
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.gameState.ai.setDifficulty(e.target.value);
        });

        document.getElementById('visionRadiusSlider').addEventListener('change', (e) => {
            const radius = parseInt(e.target.value);
            document.getElementById('visionRadiusValue').textContent = radius;
            this.gameState.visionSystem.setVisionRadius(radius);
            this.render();
        });

        // Close modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });
    }

    /**
     * Handle canvas click
     */
    handleCanvasClick(e) {
        const square = this.renderer.getSquareAtCoordinates(e.clientX, e.clientY);
        if (!square) return;

        const piece = this.gameState.board.getPieceAt(square.x, square.y);

        if (this.selectedPiece) {
            // Try to move selected piece
            if (piece === this.selectedPiece) {
                // Deselect
                this.selectedPiece = null;
                this.renderer.clearSelection();
            } else {
                // Try to move
                const success = this.gameState.makeMove(this.selectedPiece, square.x, square.y);
                if (success) {
                    this.selectedPiece = null;
                    this.renderer.clearSelection();
                    this.updateUI();
                    this.render();
                    // Trigger AI move if applicable
                    this.handleAITurn();
                } else {
                    // Select new piece if valid
                    if (piece && piece.owner === this.gameState.currentPlayer) {
                        this.selectedPiece = piece;
                        this.renderer.selectPiece(piece);
                    }
                }
            }
        } else {
            // Select piece if it belongs to current player
            if (piece && piece.owner === this.gameState.currentPlayer) {
                this.selectedPiece = piece;
                this.renderer.selectPiece(piece);
            }
        }

        this.render();
    }

    /**
     * Handle canvas mouse move
     */
    handleCanvasMouseMove(e) {
        const square = this.renderer.getSquareAtCoordinates(e.clientX, e.clientY);
        if (square) {
            this.renderer.canvas.style.cursor = 'pointer';
        } else {
            this.renderer.canvas.style.cursor = 'default';
        }
    }

    /**
     * Handle new game
     */
    handleNewGame() {
        document.getElementById('setupModal').classList.remove('hidden');
    }

    /**
     * Handle setup choice
     */
    handleSetupChoice(e) {
        const setupType = e.target.dataset.setup;
        this.gameState.initializeGame(setupType);
        document.getElementById('setupModal').classList.add('hidden');
        this.updateUI();
        this.render();
    }

    /**
     * Handle undo (placeholder)
     */
    handleUndo() {
        // TODO: Implement move history
    }

    /**
     * Handle resign
     */
    handleResign() {
        const opponent = this.gameState.currentPlayer === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;
        this.gameState.endGame(opponent);
        this.updateUI();
        this.render();
    }

    /**
     * Handle AI turn
     */
    async handleAITurn() {
        if (this.gameState.currentPlayer === this.gameState.aiPlayer && this.gameState.gameState === CONFIG.GAME_STATE.PLAYING) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay for UX
            const move = await this.gameState.getAIMove();
            if (move) {
                this.gameState.makeMove(move.piece, move.move.x, move.move.y);
                this.updateUI();
                this.render();
                // Check if human player is AI's turn again
                if (this.gameState.currentPlayer === this.gameState.aiPlayer) {
                    this.handleAITurn();
                }
            }
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update turn indicator
        const playerName = this.gameState.currentPlayer === CONFIG.PLAYERS.PLAYER1 ? 'Player 1' : 'Player 2';
        document.getElementById('turnIndicator').textContent = playerName;

        // Update move count
        document.getElementById('moveCount').textContent = this.gameState.moveCount;

        // Update game status
        const status = this.gameState.gameState === CONFIG.GAME_STATE.PLAYING ? 'Playing' : 'Game Over';
        document.getElementById('gameStatus').textContent = status;

        // Update captured pieces
        this.updateCapturedPieces();
    }

    /**
     * Update captured pieces display
     */
    updateCapturedPieces() {
        const capturedPlayer = this.gameState.board.capturedPieces[CONFIG.PLAYERS.PLAYER1];
        const capturedOpponent = this.gameState.board.capturedPieces[CONFIG.PLAYERS.PLAYER2];

        document.getElementById('capturedPlayerPieces').innerHTML = capturedPlayer
            .map(p => `<div class="captured-piece">${CONFIG.PIECE_SYMBOLS[p.type]}</div>`)
            .join('');

        document.getElementById('capturedOpponentPieces').innerHTML = capturedOpponent
            .map(p => `<div class="captured-piece">${CONFIG.PIECE_SYMBOLS[p.type]}</div>`)
            .join('');
    }

    /**
     * Show settings modal
     */
    showSettings() {
        document.getElementById('settingsModal').classList.remove('hidden');
    }

    /**
     * Hide settings modal
     */
    hideSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    /**
     * Show history modal
     */
    showHistory() {
        const historyList = document.getElementById('fullHistoryList');
        historyList.innerHTML = this.gameState.board.moveHistory
            .map((move, index) => `
                <div class="full-history-item">
                    <div class="full-history-item-move">Move ${index + 1}: ${move.piece.type.toUpperCase()} to (${move.to.x}, ${move.to.y})</div>
                    <div class="full-history-item-player">Player ${move.piece.owner + 1}</div>
                </div>
            `)
            .join('');
        document.getElementById('historyModal').classList.remove('hidden');
    }

    /**
     * Hide history modal
     */
    hideHistory() {
        document.getElementById('historyModal').classList.add('hidden');
    }

    /**
     * Render the board
     */
    render() {
        this.renderer.draw(this.gameState.currentPlayer);
    }
}
