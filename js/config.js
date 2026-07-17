/**
 * Game Configuration
 * Central place for all game settings and constants
 */

const CONFIG = {
    // Board settings
    BOARD_SIZE: 8,
    CELL_SIZE: 100,
    BOARD_WIDTH: 800,
    BOARD_HEIGHT: 800,

    // Piece settings
    PIECE_TYPES: {
        PAWN: 'pawn',
        KNIGHT: 'knight',
        BISHOP: 'bishop',
        ROOK: 'rook',
        QUEEN: 'queen',
        KING: 'king'
    },

    PIECE_VALUES: {
        pawn: 1,
        knight: 3,
        bishop: 3,
        rook: 5,
        queen: 9,
        king: 999
    },

    PIECE_SYMBOLS: {
        pawn: '♟',
        knight: '♞',
        bishop: '♝',
        rook: '♜',
        queen: '♛',
        king: '♚',
        hidden: '?'
    },

    // Game settings
    PLAYERS: {
        PLAYER1: 0,
        PLAYER2: 1
    },

    // Vision system
    VISION_RADIUS: 4,
    DEFAULT_VISION_TYPE: 'radius', // 'radius' or 'line-of-sight'

    // AI settings
    AI_DIFFICULTY: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    },

    AI_DEPTH: {
        easy: 2,
        medium: 4,
        hard: 6
    },

    AI_TIME_LIMIT: {
        easy: 500,
        medium: 1000,
        hard: 2000
    },

    // Game states
    GAME_STATE: {
        SETUP: 'setup',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },

    // Win conditions
    WIN_CONDITION: {
        CAPTURE_KING: 'captureKing',
        ELIMINATE_ALL: 'eliminateAll'
    },

    // Colors
    COLORS: {
        PLAYER1: '#1e40af',
        PLAYER2: '#dc2626',
        LIGHT_SQUARE: '#f0e6d2',
        DARK_SQUARE: '#d4a574',
        HIGHLIGHT: '#fbbf24',
        VALID_MOVE: '#60a5fa',
        CAPTURE: '#f87171',
        SELECTED: '#3b82f6'
    },

    // Animation settings
    ANIMATION_DURATION: 300,
    ANIMATION_ENABLED: true,
    SOUND_ENABLED: true,

    // Initial piece setup (can be customized)
    INITIAL_SETUP: 'standard' // 'standard', 'random', or custom array
};

// Piece starting positions for standard setup
CONFIG.STANDARD_POSITIONS = {
    player1: [
        { type: 'rook', x: 0, y: 7 },
        { type: 'knight', x: 1, y: 7 },
        { type: 'bishop', x: 2, y: 7 },
        { type: 'queen', x: 3, y: 7 },
        { type: 'king', x: 4, y: 7 },
        { type: 'bishop', x: 5, y: 7 },
        { type: 'knight', x: 6, y: 7 },
        { type: 'rook', x: 7, y: 7 },
        { type: 'pawn', x: 0, y: 6 },
        { type: 'pawn', x: 1, y: 6 },
        { type: 'pawn', x: 2, y: 6 },
        { type: 'pawn', x: 3, y: 6 },
        { type: 'pawn', x: 4, y: 6 },
        { type: 'pawn', x: 5, y: 6 },
        { type: 'pawn', x: 6, y: 6 },
        { type: 'pawn', x: 7, y: 6 }
    ],
    player2: [
        { type: 'pawn', x: 0, y: 1 },
        { type: 'pawn', x: 1, y: 1 },
        { type: 'pawn', x: 2, y: 1 },
        { type: 'pawn', x: 3, y: 1 },
        { type: 'pawn', x: 4, y: 1 },
        { type: 'pawn', x: 5, y: 1 },
        { type: 'pawn', x: 6, y: 1 },
        { type: 'pawn', x: 7, y: 1 },
        { type: 'rook', x: 0, y: 0 },
        { type: 'knight', x: 1, y: 0 },
        { type: 'bishop', x: 2, y: 0 },
        { type: 'queen', x: 3, y: 0 },
        { type: 'king', x: 4, y: 0 },
        { type: 'bishop', x: 5, y: 0 },
        { type: 'knight', x: 6, y: 0 },
        { type: 'rook', x: 7, y: 0 }
    ]
};

Object.freeze(CONFIG);