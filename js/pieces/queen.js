/**
 * Queen Piece
 * Moves like a rook (horizontally/vertically) or bishop (diagonally)
 */

class Queen extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.QUEEN, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
            // Horizontal and vertical (rook moves)
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            // Diagonal (bishop moves)
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ];

        for (const direction of directions) {
            moves.push(...this.canMoveInDirection(board, direction.dx, direction.dy));
        }

        return moves;
    }
}
