/**
 * Bishop Piece
 * Moves diagonally any number of squares
 */

class Bishop extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.BISHOP, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
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
