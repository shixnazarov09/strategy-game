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
        document.getElementById('closeHistoryBtn').addEventListener('click', () => this.hideHistory());

        // Setup modal buttons
        const setupButtons = document.querySelectorAll('#setupModal .setup-options button');
        setupButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const setupType = e.target.getAttribute('data-setup');
                console.log('Setup button clicked with type:', setupType);
                this.startGameWithSetup(setupType);
            });
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

        // Game over modal buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => this.handleNewGame());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.handleNewGame());
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
     * Start game with selected setup
     */
    startGameWithSetup(setupType) {
        if (!setupType) {
            console.error('No setup type provided');
            return;
        }
        
        this.gameState.initializeGame(setupType);
        document.getElementById('setupModal').classList.add('hidden');
        this.updateUI();
        this.render();
        
        // Trigger AI move if it's AI's turn
        if (this.gameState.currentPlayer === this.gameState.aiPlayer) {
            this.handleAITurn();
        }
    }

    /**
     * Handle undo (placeholder)
     */
    handleUndo() {
        // TODO: Implement move history
        console.log('Undo not yet implemented');
    }

    /**
     * Handle resign
     */
    handleResign() {
        const opponent = this.gameState.currentPlayer === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;
        this.gameState.endGame(opponent);
        this.showGameOver(opponent);
        this.render();
    }

    /**
     * Handle AI turn
     */
    async handleAITurn() {
        if (this.gameState.currentPlayer === this.gameState.aiPlayer && this.gameState.gameState === CONFIG.GAME_STATE.PLAYING) {
            document.getElementById('gameStatus').textContent = 'AI Thinking...';
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay for UX
            const move = await this.gameState.getAIMove();
            if (move) {
                this.gameState.makeMove(move.piece, move.move.x, move.move.y);
                this.updateUI();
                this.render();

                // Check for game over
                if (this.gameState.gameState === CONFIG.GAME_STATE.GAME_OVER) {
                    this.showGameOver(this.gameState.gameWinner);
                    return;
                }

                // Check if opponent still needs to play
                if (this.gameState.currentPlayer === this.gameState.aiPlayer) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    this.handleAITurn();
                }
            }
        }
    }

    /**
     * Show game over modal
     */
    showGameOver(winner) {
        const winnerName = winner === CONFIG.PLAYERS.PLAYER1 ? 'Player 1 (You)' : 'Player 2 (AI)';
        document.getElementById('gameOverTitle').textContent = 'Game Over!';
        document.getElementById('gameOverMessage').textContent = `${winnerName} wins!`;
        document.getElementById('gameOverModal').classList.remove('hidden');
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
        if (this.gameState.board.moveHistory.length === 0) {
            historyList.innerHTML = '<p style="padding: 1rem; text-align: center; color: #64748b;">No moves yet</p>';
        } else {
            historyList.innerHTML = this.gameState.board.moveHistory
                .map((move, index) => `
                    <div class="full-history-item">
                        <div class="full-history-item-move">Move ${index + 1}: ${move.piece.type.toUpperCase()} to (${move.to.x}, ${move.to.y})</div>
                        <div class="full-history-item-player">Player ${move.piece.owner + 1}</div>
                    </div>
                `)
                .join('');
        }
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
