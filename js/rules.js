/**
 * Game Rules Engine
 * Validates moves, checks win conditions, and manages game flow
 */

class Rules {
    constructor(board) {
        this.board = board;
        this.winCondition = CONFIG.WIN_CONDITION.CAPTURE_KING;
    }

    /**
     * Check if a move is legal
     */
    isLegalMove(piece, targetX, targetY, currentPlayer) {
        // Only current player's pieces can move
        if (piece.owner !== currentPlayer) {
            return false;
        }

        // Check if move is valid for this piece type
        if (!piece.isValidMove(this.board, targetX, targetY)) {
            return false;
        }

        // Make the move temporarily
        const originalX = piece.x;
        const originalY = piece.y;
        const capturedPiece = this.board.getPieceAt(targetX, targetY);

        // Simulate the move
        piece.x = targetX;
        piece.y = targetY;
        if (capturedPiece) {
            this.board.removePiece(capturedPiece);
        } else {
            this.board.grid[originalY][originalX] = null;
            this.board.grid[targetY][targetX] = piece;
        }

        // Check if king is in check after move
        const kingInCheck = this.isKingInCheck(currentPlayer);

        // Undo the simulation
        piece.x = originalX;
        piece.y = originalY;
        this.board.grid[originalY][originalX] = piece;
        this.board.grid[targetY][targetX] = capturedPiece;
        if (capturedPiece) {
            this.board.pieces.push(capturedPiece);
        }

        return !kingInCheck;
    }

    /**
     * Check if a player's king is in check
     */
    isKingInCheck(player) {
        const king = this.board.getKingForPlayer(player);
        if (!king) return false;

        const opponent = player === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;
        const opponentPieces = this.board.getPiecesForPlayer(opponent);

        // Check if any opponent piece can attack the king
        for (const piece of opponentPieces) {
            if (piece.canAttack(this.board, king.x, king.y)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a player is in checkmate
     */
    isCheckmate(player) {
        if (!this.isKingInCheck(player)) {
            return false;
        }

        // Check if player has any legal moves
        const playerPieces = this.board.getPiecesForPlayer(player);
        for (const piece of playerPieces) {
            const validMoves = piece.getValidMoves(this.board);
            for (const move of validMoves) {
                if (this.isLegalMove(piece, move.x, move.y, player)) {
                    return false; // Found a legal move
                }
            }
        }

        return true; // No legal moves and in check
    }

    /**
     * Check if a player has any legal moves (stalemate)
     */
    hasLegalMoves(player) {
        const playerPieces = this.board.getPiecesForPlayer(player);
        for (const piece of playerPieces) {
            const validMoves = piece.getValidMoves(this.board);
            for (const move of validMoves) {
                if (this.isLegalMove(piece, move.x, move.y, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check win condition
     */
    checkWinCondition(player) {
        const opponent = player === CONFIG.PLAYERS.PLAYER1 ? CONFIG.PLAYERS.PLAYER2 : CONFIG.PLAYERS.PLAYER1;

        switch (this.winCondition) {
            case CONFIG.WIN_CONDITION.CAPTURE_KING:
                const opponentKing = this.board.getKingForPlayer(opponent);
                return !opponentKing || opponentKing.captured;

            case CONFIG.WIN_CONDITION.ELIMINATE_ALL:
                const opponentPieces = this.board.getPiecesForPlayer(opponent);
                return opponentPieces.length === 0;

            default:
                return false;
        }
    }

    /**
     * Execute a move (after validation)
     */
    executeMove(piece, targetX, targetY) {
        if (!this.isLegalMove(piece, targetX, targetY, piece.owner)) {
            return false;
        }

        const targetPiece = this.board.getPieceAt(targetX, targetY);
        piece.moveTo(this.board, targetX, targetY);

        // Reveal attacking and attacked pieces
        if (targetPiece) {
            piece.reveal();
            targetPiece.reveal();
        } else {
            piece.reveal();
        }

        return true;
    }

    /**
     * Get all legal moves for a player
     */
    getLegalMovesForPlayer(player) {
        const legalMoves = {};
        const playerPieces = this.board.getPiecesForPlayer(player);

        for (const piece of playerPieces) {
            const validMoves = piece.getValidMoves(this.board);
            const legalMovesForPiece = [];

            for (const move of validMoves) {
                if (this.isLegalMove(piece, move.x, move.y, player)) {
                    legalMovesForPiece.push(move);
                }
            }

            if (legalMovesForPiece.length > 0) {
                legalMoves[piece.id] = legalMovesForPiece;
            }
        }

        return legalMoves;
    }
}
