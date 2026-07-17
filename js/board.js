/**
 * Board Management
 * Handles the game board state and piece placement
 */

class Board {
    constructor() {
        this.grid = this.initializeGrid();
        this.pieces = [];
        this.capturedPieces = { [CONFIG.PLAYERS.PLAYER1]: [], [CONFIG.PLAYERS.PLAYER2]: [] };
        this.moveHistory = [];
    }

    /**
     * Initialize empty grid
     */
    initializeGrid() {
        const grid = [];
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            grid[y] = [];
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                grid[y][x] = null;
            }
        }
        return grid;
    }

    /**
     * Add a piece to the board
     */
    addPiece(piece) {
        if (!this.isValidPosition(piece.x, piece.y)) {
            console.warn('Invalid piece position:', piece.x, piece.y);
            return false;
        }
        this.grid[piece.y][piece.x] = piece;
        this.pieces.push(piece);
        return true;
    }

    /**
     * Remove a piece from the board
     */
    removePiece(piece) {
        if (this.grid[piece.y] && this.grid[piece.y][piece.x] === piece) {
            this.grid[piece.y][piece.x] = null;
        }
        const index = this.pieces.indexOf(piece);
        if (index > -1) {
            this.pieces.splice(index, 1);
        }
    }

    /**
     * Get piece at position
     */
    getPieceAt(x, y) {
        if (!this.isValidPosition(x, y)) return null;
        return this.grid[y][x];
    }

    /**
     * Move a piece from one position to another
     */
    movePiece(piece, newX, newY) {
        if (!this.isValidPosition(newX, newY)) {
            return false;
        }

        // Remove piece at destination if exists
        const targetPiece = this.getPieceAt(newX, newY);
        if (targetPiece) {
            this.capturePiece(targetPiece);
        }

        // Remove from old position
        this.grid[piece.y][piece.x] = null;

        // Move to new position
        piece.x = newX;
        piece.y = newY;
        this.grid[newY][newX] = piece;

        // Track move
        this.moveHistory.push({
            piece: piece,
            from: { x: piece.x - (newX - piece.x), y: piece.y - (newY - piece.y) },
            to: { x: newX, y: newY },
            captured: targetPiece,
            timestamp: Date.now()
        });

        return true;
    }

    /**
     * Capture a piece
     */
    capturePiece(piece) {
        this.removePiece(piece);
        this.capturedPieces[piece.owner].push(piece);
        piece.captured = true;
    }

    /**
     * Get all pieces for a player
     */
    getPiecesForPlayer(player) {
        return this.pieces.filter(piece => piece.owner === player && !piece.captured);
    }

    /**
     * Get king for a player
     */
    getKingForPlayer(player) {
        const pieces = this.getPiecesForPlayer(player);
        return pieces.find(piece => piece.type === CONFIG.PIECE_TYPES.KING);
    }

    /**
     * Check if a position is valid
     */
    isValidPosition(x, y) {
        return x >= 0 && x < CONFIG.BOARD_SIZE && y >= 0 && y < CONFIG.BOARD_SIZE;
    }

    /**
     * Check if a position is occupied
     */
    isOccupied(x, y) {
        return this.getPieceAt(x, y) !== null;
    }

    /**
     * Get all pieces (including captured)
     */
    getAllPieces() {
        return this.pieces;
    }

    /**
     * Clear the board
     */
    clear() {
        this.grid = this.initializeGrid();
        this.pieces = [];
        this.capturedPieces = { [CONFIG.PLAYERS.PLAYER1]: [], [CONFIG.PLAYERS.PLAYER2]: [] };
        this.moveHistory = [];
    }

    /**
     * Get board state for debugging
     */
    getBoardState() {
        const state = [];
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            const row = [];
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                const piece = this.grid[y][x];
                row.push(piece ? `${piece.owner === CONFIG.PLAYERS.PLAYER1 ? 'W' : 'B'}${piece.type[0].toUpperCase()}` : '.');
            }
            state.push(row.join(' '));
        }
        return state;
    }
}
