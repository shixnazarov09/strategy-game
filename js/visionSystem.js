/**
 * Vision System
 * Implements fog-of-war and piece visibility
 */

class VisionSystem {
    constructor(board) {
        this.board = board;
        this.visionRadius = CONFIG.VISION_RADIUS;
        this.visibilityMap = this.initVisibilityMap();
    }

    /**
     * Initialize visibility map for both players
     */
    initVisibilityMap() {
        return {
            [CONFIG.PLAYERS.PLAYER1]: this.createEmptyVisibilityGrid(),
            [CONFIG.PLAYERS.PLAYER2]: this.createEmptyVisibilityGrid()
        };
    }

    /**
     * Create empty visibility grid
     */
    createEmptyVisibilityGrid() {
        const grid = [];
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            grid[y] = [];
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                grid[y][x] = false;
            }
        }
        return grid;
    }

    /**
     * Update visibility for all players
     */
    updateVisibility() {
        this.visibilityMap[CONFIG.PLAYERS.PLAYER1] = this.createEmptyVisibilityGrid();
        this.visibilityMap[CONFIG.PLAYERS.PLAYER2] = this.createEmptyVisibilityGrid();

        const pieces = this.board.getAllPieces();
        for (const piece of pieces) {
            if (!piece.captured) {
                this.updatePieceVisibility(piece);
            }
        }
    }

    /**
     * Update visibility based on a single piece
     */
    updatePieceVisibility(piece) {
        const player = piece.owner;
        const visibilityGrid = this.visibilityMap[player];

        // Mark piece's own position
        visibilityGrid[piece.y][piece.x] = true;

        // Mark vision radius around piece
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                const distance = Math.max(Math.abs(x - piece.x), Math.abs(y - piece.y));
                if (distance <= this.visionRadius) {
                    visibilityGrid[y][x] = true;
                }
            }
        }
    }

    /**
     * Check if a position is visible to a player
     */
    isVisible(player, x, y) {
        if (!this.board.isValidPosition(x, y)) return false;
        return this.visibilityMap[player][y][x];
    }

    /**
     * Get visible pieces for a player
     */
    getVisiblePieces(player) {
        const visiblePieces = [];
        const allPieces = this.board.getAllPieces();

        for (const piece of allPieces) {
            if (piece.captured) continue;

            // Always see own pieces
            if (piece.owner === player) {
                visiblePieces.push(piece);
            }
            // See revealed enemy pieces if visible
            else if (piece.revealed && this.isVisible(player, piece.x, piece.y)) {
                visiblePieces.push(piece);
            }
            // See hidden enemy pieces only at their exact position
            else if (!piece.revealed && piece.x === piece.x && piece.y === piece.y && this.isVisible(player, piece.x, piece.y)) {
                visiblePieces.push(piece);
            }
        }

        return visiblePieces;
    }

    /**
     * Get piece display for a player (revealed or hidden)
     */
    getPieceDisplay(player, piece) {
        if (piece.owner === player) {
            // Always show own pieces fully
            return {
                symbol: CONFIG.PIECE_SYMBOLS[piece.type],
                revealed: true,
                type: piece.type
            };
        }

        if (piece.revealed && this.isVisible(player, piece.x, piece.y)) {
            // Show revealed enemy pieces
            return {
                symbol: CONFIG.PIECE_SYMBOLS[piece.type],
                revealed: true,
                type: piece.type
            };
        }

        if (!piece.revealed && this.isVisible(player, piece.x, piece.y)) {
            // Show as unknown
            return {
                symbol: CONFIG.PIECE_SYMBOLS.hidden,
                revealed: false,
                type: null
            };
        }

        // Not visible
        return null;
    }

    /**
     * Set vision radius
     */
    setVisionRadius(radius) {
        this.visionRadius = Math.max(1, Math.min(radius, CONFIG.BOARD_SIZE));
        this.updateVisibility();
    }

    /**
     * Get visibility map for debugging
     */
    getVisibilityDebug(player) {
        const map = [];
        for (let y = 0; y < CONFIG.BOARD_SIZE; y++) {
            const row = [];
            for (let x = 0; x < CONFIG.BOARD_SIZE; x++) {
                row.push(this.visibilityMap[player][y][x] ? '✓' : '·');
            }
            map.push(row.join(' '));
        }
        return map;
    }
}
