/**
 * King Piece
 * Moves one square in any direction
 */

class King extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.KING, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ];

        for (const direction of directions) {
            const newX = this.x + direction.dx;
            const newY = this.y + direction.dy;

            if (board.isValidPosition(newX, newY)) {
                const piece = board.getPieceAt(newX, newY);
                if (!piece || piece.owner !== this.owner) {
                    moves.push({ x: newX, y: newY });
                }
            }
        }

        return moves;
    }
}
