/**
 * Rook Piece
 * Moves horizontally or vertically any number of squares
 */

class Rook extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.ROOK, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        for (const direction of directions) {
            moves.push(...this.canMoveInDirection(board, direction.dx, direction.dy));
        }

        return moves;
    }
}
