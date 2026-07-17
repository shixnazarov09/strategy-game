/**
 * AI System
 * Computer opponent with configurable difficulty levels
 */

class AI {
    constructor(board, rules, visionSystem, difficulty = CONFIG.AI_DIFFICULTY.MEDIUM) {
        this.board = board;
        this.rules = rules;
        this.visionSystem = visionSystem;
        this.difficulty = difficulty;
        this.isThinking = false;
    }

    /**
     * Get best move for AI
     */
    async getBestMove(playerToMove) {
        this.isThinking = true;
        const depth = CONFIG.AI_DEPTH[this.difficulty];
        const timeLimit = CONFIG.AI_TIME_LIMIT[this.difficulty];

        return new Promise((resolve) => {
            const startTime = Date.now();

            let bestMove = null;
            let bestScore = -Infinity;

            const legalMoves = this.rules.getLegalMovesForPlayer(playerToMove);

            for (const [pieceId, moves] of Object.entries(legalMoves)) {
                const piece = this.board.pieces.find(p => p.id === pieceId);
                if (!piece) continue;

                for (const move of moves) {
                    // Time limit check
                    if (Date.now() - startTime > timeLimit) {
                        this.isThinking = false;
                        return resolve(bestMove);
                    }

                    // Simulate move
                    const targetPiece = this.board.getPieceAt(move.x, move.y);
                    const originalX = piece.x;
                    const originalY = piece.y;

                    piece.x = move.x;
                    piece.y = move.y;
                    if (targetPiece) this.board.removePiece(targetPiece);
                    else {
                        this.board.grid[originalY][originalX] = null;
                        this.board.grid[move.y][move.x] = piece;
                    }

                    // Evaluate position
                    const score = this.evaluatePosition(playerToMove, depth - 1);

                    // Undo move
                    piece.x = originalX;
                    piece.y = originalY;
                    this.board.grid[originalY][originalX] = piece;
                    this.board.grid[move.y][move.x] = targetPiece;
                    if (targetPiece) this.board.pieces.push(targetPiece);

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { piece, move };
                    }
                }
            }

            this.isThinking = false;
            resolve(bestMove);
        });
    }

    /**
     * Evaluate board position
     */
    evaluatePosition(player, depth) {
        const opponent = player === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;

        // Terminal states
        if (this.rules.checkWinCondition(player)) {
            return 10000 + depth; // Prefer faster wins
        }
        if (this.rules.checkWinCondition(opponent)) {
            return -10000 - depth;
        }

        // Evaluate material
        let score = 0;
        const playerPieces = this.board.getPiecesForPlayer(player);
        const opponentPieces = this.board.getPiecesForPlayer(opponent);

        for (const piece of playerPieces) {
            score += piece.getValue();
        }
        for (const piece of opponentPieces) {
            score -= piece.getValue();
        }

        // Positional evaluation
        score += this.evaluatePositions(player);
        score -= this.evaluatePositions(opponent);

        // Check threat evaluation
        if (this.rules.isKingInCheck(opponent)) {
            score += 100;
        }
        if (this.rules.isKingInCheck(player)) {
            score -= 100;
        }

        // Recursive evaluation if depth allows
        if (depth > 0) {
            const legalMoves = this.rules.getLegalMovesForPlayer(opponent);
            if (Object.keys(legalMoves).length === 0) {
                // No legal moves
                if (this.rules.isKingInCheck(opponent)) {
                    score += 5000; // Checkmate-like situation
                } else {
                    score += 2000; // Stalemate-like situation
                }
            }
        }

        return score;
    }

    /**
     * Evaluate piece positions
     */
    evaluatePositions(player) {
        let score = 0;
        const pieces = this.board.getPiecesForPlayer(player);

        for (const piece of pieces) {
            // Pawns advance towards enemy
            if (piece.type === CONFIG.PIECE_TYPES.PAWN) {
                const advancement = player === CONFIG.PLAYERS.PLAYER1 ? (7 - piece.y) : piece.y;
                score += advancement * 2;
            }

            // Center control
            const distanceFromCenter = Math.max(
                Math.abs(piece.x - 3.5),
                Math.abs(piece.y - 3.5)
            );
            score += (8 - distanceFromCenter) * 0.5;

            // Piece activity (number of legal moves)
            const validMoves = piece.getValidMoves(this.board);
            score += validMoves.length * 0.1;
        }

        return score;
    }

    /**
     * Set difficulty
     */
    setDifficulty(difficulty) {
        if (Object.values(CONFIG.AI_DIFFICULTY).includes(difficulty)) {
            this.difficulty = difficulty;
        }
    }
}
