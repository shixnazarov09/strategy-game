/**
 * Pawn Piece
 * Moves forward one square, attacks diagonally
 */

class Pawn extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.PAWN, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const direction = this.owner === CONFIG.PLAYERS.PLAYER1 ? -1 : 1;
        const startRow = this.owner === CONFIG.PLAYERS.PLAYER1 ? 6 : 1;

        // Move forward one square
        const nextY = this.y + direction;
        if (board.isValidPosition(this.x, nextY) && !board.isOccupied(this.x, nextY)) {
            moves.push({ x: this.x, y: nextY });

            // Move forward two squares from starting position
            if (this.moveCount === 0) {
                const twoSquaresY = this.y + 2 * direction;
                if (board.isValidPosition(this.x, twoSquaresY) && !board.isOccupied(this.x, twoSquaresY)) {
                    moves.push({ x: this.x, y: twoSquaresY });
                }
            }
        }

        // Capture diagonally
        for (let dx of [-1, 1]) {
            const captureX = this.x + dx;
            const captureY = this.y + direction;
            if (board.isValidPosition(captureX, captureY)) {
                const piece = board.getPieceAt(captureX, captureY);
                if (piece && piece.owner !== this.owner) {
                    moves.push({ x: captureX, y: captureY });
                }
            }
        }

        return moves;
    }
}
