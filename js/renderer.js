/**
 * Renderer
 * Handles canvas drawing and piece rendering
 */

class Renderer {
    constructor(canvasId, board, visionSystem) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.board = board;
        this.visionSystem = visionSystem;
        this.cellSize = CONFIG.CELL_SIZE;
        this.selectedPiece = null;
        this.validMoves = [];
        this.highlightedSquares = [];
    }

    /**
     * Draw the entire board
     */
    draw(currentPlayer) {
        this.drawBoard();
        this.drawSquareHighlights();
        this.drawValidMoves();
        this.drawPieces(currentPlayer);
        this.drawSelection();
    }

    /**
     * Draw the board grid
     */
    drawBoard() {
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                const isLight = (x + y) % 2 === 0;
                this.ctx.fillStyle = isLight ? CONFIG.COLORS.LIGHT_SQUARE : CONFIG.COLORS.DARK_SQUARE;
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

                // Draw grid lines
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    /**
     * Draw highlighted squares
     */
    drawSquareHighlights() {
        for (const square of this.highlightedSquares) {
            this.ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
            this.ctx.fillRect(square.x * this.cellSize, square.y * this.cellSize, this.cellSize, this.cellSize);
        }
    }

    /**
     * Draw valid move indicators
     */
    drawValidMoves() {
        for (const move of this.validMoves) {
            const x = move.x * this.cellSize + this.cellSize / 2;
            const y = move.y * this.cellSize + this.cellSize / 2;

            // Check if there's a piece at this location
            const piece = this.board.getPieceAt(move.x, move.y);
            const radius = piece ? this.cellSize / 3 : this.cellSize / 8;

            this.ctx.fillStyle = piece ? CONFIG.COLORS.CAPTURE : CONFIG.COLORS.VALID_MOVE;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Draw pieces
     */
    drawPieces(currentPlayer) {
        const pieces = this.board.getAllPieces();

        for (const piece of pieces) {
            if (piece.captured) continue;

            // Check if piece is visible to current player
            const display = this.visionSystem.getPieceDisplay(currentPlayer, piece);
            if (!display) continue;

            this.drawPiece(piece, display);
        }
    }

    /**
     * Draw a single piece
     */
    drawPiece(piece, display) {
        const x = piece.x * this.cellSize + this.cellSize / 2;
        const y = piece.y * this.cellSize + this.cellSize / 2;

        // Draw piece background
        this.ctx.fillStyle = piece.owner === CONFIG.PLAYERS.PLAYER1 ? CONFIG.COLORS.PLAYER1 : CONFIG.COLORS.PLAYER2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.cellSize / 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${this.cellSize / 1.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(display.symbol, x, y);
    }

    /**
     * Draw selection highlight
     */
    drawSelection() {
        if (this.selectedPiece) {
            const x = this.selectedPiece.x * this.cellSize;
            const y = this.selectedPiece.y * this.cellSize;

            this.ctx.strokeStyle = CONFIG.COLORS.SELECTED;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        }
    }

    /**
     * Select a piece
     */
    selectPiece(piece) {
        this.selectedPiece = piece;
        if (piece) {
            this.validMoves = piece.getValidMoves(this.board);
        } else {
            this.validMoves = [];
        }
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedPiece = null;
        this.validMoves = [];
    }

    /**
     * Set highlighted squares
     */
    setHighlightedSquares(squares) {
        this.highlightedSquares = squares;
    }

    /**
     * Get square at canvas coordinates
     */
    getSquareAtCoordinates(canvasX, canvasY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((canvasX - rect.left) / this.cellSize);
        const y = Math.floor((canvasY - rect.top) / this.cellSize);

        if (this.board.isValidPosition(x, y)) {
            return { x, y };
        }
        return null;
    }
}
