/**
 * Knight Piece
 * Moves in L-shape: 2 squares in one direction, 1 in perpendicular
 */

class Knight extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.KNIGHT, owner, x, y);
    }

    getValidMoves(board) {
        const moves = [];
        const knightMoves = [
            { dx: 2, dy: 1 },
            { dx: 2, dy: -1 },
            { dx: -2, dy: 1 },
            { dx: -2, dy: -1 },
            { dx: 1, dy: 2 },
            { dx: 1, dy: -2 },
            { dx: -1, dy: 2 },
            { dx: -1, dy: -2 }
        ];

        for (const move of knightMoves) {
            const newX = this.x + move.dx;
            const newY = this.y + move.dy;

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
