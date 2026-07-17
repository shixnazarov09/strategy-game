/**
 * Base Piece Class
 * All pieces inherit from this class
 */

class Piece {
    constructor(type, owner, x, y) {
        this.type = type;
        this.owner = owner; // CONFIG.PLAYERS.PLAYER1 or PLAYER2
        this.x = x;
        this.y = y;
        this.revealed = owner === CONFIG.PLAYERS.PLAYER1; // Player 1 always sees their pieces
        this.captured = false;
        this.moveCount = 0;
        this.id = this.generateId();
    }

    /**
     * Generate unique ID for piece
     */
    generateId() {
        return `${this.type}-${this.owner}-${Date.now()}-${Math.random()}`;
    }

    /**
     * Reveal the piece
     */
    reveal() {
        this.revealed = true;
    }

    /**
     * Get valid moves for this piece
     * Must be implemented by subclasses
     */
    getValidMoves(board) {
        throw new Error('getValidMoves must be implemented by subclass');
    }

    /**
     * Check if a move is valid
     */
    isValidMove(board, targetX, targetY) {
        const validMoves = this.getValidMoves(board);
        return validMoves.some(move => move.x === targetX && move.y === targetY);
    }

    /**
     * Execute move (called after validation)
     */
    moveTo(board, targetX, targetY) {
        const success = board.movePiece(this, targetX, targetY);
        if (success) {
            this.moveCount++;
        }
        return success;
    }

    /**
     * Check if this piece attacks a position
     */
    canAttack(board, targetX, targetY) {
        return this.getValidMoves(board).some(move => move.x === targetX && move.y === targetY);
    }

    /**
     * Get piece value for AI evaluation
     */
    getValue() {
        return CONFIG.PIECE_VALUES[this.type] || 0;
    }

    /**
     * Get symbol for display
     */
    getSymbol() {
        return this.revealed ? CONFIG.PIECE_SYMBOLS[this.type] : CONFIG.PIECE_SYMBOLS.hidden;
    }

    /**
     * Check if can move in a direction (for sliding pieces)
     */
    canMoveInDirection(board, dx, dy, maxDistance = CONFIG.BOARD_SIZE) {
        const moves = [];
        let x = this.x + dx;
        let y = this.y + dy;
        let distance = 0;

        while (board.isValidPosition(x, y) && distance < maxDistance) {
            const piece = board.getPieceAt(x, y);

            if (piece) {
                // Can capture enemy piece
                if (piece.owner !== this.owner) {
                    moves.push({ x, y });
                }
                break; // Stop sliding
            }

            moves.push({ x, y });
            x += dx;
            y += dy;
            distance++;
        }

        return moves;
    }

    /**
     * Serialize piece data
     */
    toJSON() {
        return {
            type: this.type,
            owner: this.owner,
            x: this.x,
            y: this.y,
            revealed: this.revealed,
            captured: this.captured,
            moveCount: this.moveCount,
            id: this.id
        };
    }

    /**
     * Clone this piece
     */
    clone() {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.assign(clone, this);
        clone.id = clone.generateId();
        return clone;
    }
}
