/**
 * Game State Manager
 * Manages overall game state and flow
 */

class GameState {
    constructor() {
        this.board = new Board();
        this.rules = new Rules(this.board);
        this.visionSystem = new VisionSystem(this.board);
        this.ai = new AI(this.board, this.rules, this.visionSystem);
        this.renderer = null; // Set after UI initialization

        this.gameState = CONFIG.GAME_STATE.SETUP;
        this.currentPlayer = CONFIG.PLAYERS.PLAYER1;
        this.playingAgainstAI = true;
        this.aiPlayer = CONFIG.PLAYERS.PLAYER2;
        this.moveCount = 0;
    }

    /**
     * Initialize game with setup mode
     */
    initializeGame(setupMode = 'standard') {
        this.board.clear();
        this.setupPieces(setupMode);
        this.visionSystem.updateVisibility();
        this.gameState = CONFIG.GAME_STATE.PLAYING;
        this.currentPlayer = CONFIG.PLAYERS.PLAYER1;
        this.moveCount = 0;
    }

    /**
     * Setup pieces based on mode
     */
    setupPieces(mode) {
        let setup = null;

        switch (mode) {
            case 'standard':
                setup = CONFIG.STANDARD_POSITIONS;
                break;
            case 'random':
                setup = this.generateRandomSetup();
                break;
            default:
                setup = CONFIG.STANDARD_POSITIONS;
        }

        // Add player 1 pieces
        for (const pieceData of setup.player1) {
            const PieceClass = this.getPieceClass(pieceData.type);
            const piece = new PieceClass(CONFIG.PLAYERS.PLAYER1, pieceData.x, pieceData.y);
            piece.revealed = true; // Player always sees own pieces
            this.board.addPiece(piece);
        }

        // Add player 2 pieces
        for (const pieceData of setup.player2) {
            const PieceClass = this.getPieceClass(pieceData.type);
            const piece = new PieceClass(CONFIG.PLAYERS.PLAYER2, pieceData.x, pieceData.y);
            piece.revealed = false; // Initially hidden
            this.board.addPiece(piece);
        }
    }

    /**
     * Get piece class by type
     */
    getPieceClass(type) {
        switch (type) {
            case CONFIG.PIECE_TYPES.PAWN:
                return Pawn;
            case CONFIG.PIECE_TYPES.KNIGHT:
                return Knight;
            case CONFIG.PIECE_TYPES.BISHOP:
                return Bishop;
            case CONFIG.PIECE_TYPES.ROOK:
                return Rook;
            case CONFIG.PIECE_TYPES.QUEEN:
                return Queen;
            case CONFIG.PIECE_TYPES.KING:
                return King;
            default:
                return Piece;
        }
    }

    /**
     * Generate random piece setup
     */
    generateRandomSetup() {
        const setup = {
            player1: this.randomizeBackRanks(CONFIG.STANDARD_POSITIONS.player1, true),
            player2: this.randomizeBackRanks(CONFIG.STANDARD_POSITIONS.player2, false)
        };
        return setup;
    }

    /**
     * Randomize piece positions in back ranks
     */
    randomizeBackRanks(positions, isPlayer1) {
        const backRankPositions = positions.filter(p => isPlayer1 ? p.y === 7 : p.y === 0);
        const pawns = positions.filter(p => isPlayer1 ? p.y === 6 : p.y === 1);

        // Shuffle back rank
        const shuffled = this.shuffleArray([...backRankPositions]);
        for (let i = 0; i < backRankPositions.length; i++) {
            shuffled[i].x = backRankPositions[i].x;
        }

        return [...shuffled, ...pawns];
    }

    /**
     * Utility: shuffle array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Make a move
     */
    makeMove(piece, targetX, targetY) {
        if (this.gameState !== CONFIG.GAME_STATE.PLAYING) {
            return false;
        }

        if (piece.owner !== this.currentPlayer) {
            return false;
        }

        const success = this.rules.executeMove(piece, targetX, targetY);
        if (!success) {
            return false;
        }

        this.moveCount++;
        this.visionSystem.updateVisibility();

        // Check win conditions
        if (this.rules.checkWinCondition(this.currentPlayer)) {
            this.endGame(this.currentPlayer);
            return true;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;

        // Check if opponent has legal moves
        if (!this.rules.hasLegalMoves(this.currentPlayer)) {
            this.endGame(this.currentPlayer === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1);
        }

        return true;
    }

    /**
     * Get AI move
     */
    async getAIMove() {
        if (this.currentPlayer !== this.aiPlayer || !this.playingAgainstAI) {
            return null;
        }
        return await this.ai.getBestMove(this.currentPlayer);
    }

    /**
     * End game
     */
    endGame(winner) {
        this.gameState = CONFIG.GAME_STATE.GAME_OVER;
        this.gameWinner = winner;
    }

    /**
     * Reset game
     */
    reset() {
        this.gameState = CONFIG.GAME_STATE.SETUP;
        this.currentPlayer = CONFIG.PLAYERS.PLAYER1;
        this.moveCount = 0;
        this.gameWinner = null;
        this.board.clear();
    }
}
