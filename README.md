# Strategy Game - Hidden Information Chess Variant

A polished, browser-based strategy board game inspired by chess but with a unique twist: **hidden information, fog-of-war, and strategic deduction**.

## 🎮 Game Features

### Core Mechanics
- **8×8 Board** with clean, modern interface
- **Hidden Pieces** - Enemy pieces start hidden and are revealed only when attacked or attacking
- **Fog of War** - Configurable vision radius limits what players can see
- **Mixed Starting Positions** - Random or standard piece arrangements to prevent memorized openings
- **Smooth Animations** - Fluid piece movement and visual feedback

### Game Elements
- **6 Piece Types**: Pawn, Knight, Bishop, Rook, Queen, King
- **Turn-based Gameplay** - Clear turn indicator and game status
- **Move History** - Track all moves made during the game
- **Captured Pieces Panel** - View pieces captured by each player
- **Responsive Design** - Works on desktop and tablet devices

### AI Opponent
- **Three Difficulty Levels**:
  - 🟢 **Easy** - Basic moves, limited lookahead
  - 🟡 **Medium** - Strategic moves, moderate depth evaluation
  - 🔴 **Hard** - Advanced strategy, deep game tree analysis
- **Hidden Information Aware** - AI respects fog-of-war rules
- **Configurable** - Adjust difficulty mid-game

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shixnazarov09/strategy-game.git
cd strategy-game
```

2. Open in browser:
```bash
# Simply open index.html in your web browser
open index.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Quick Start

1. **Open** `index.html` in your browser
2. **Choose Setup**: Select between Random, Standard, or Custom piece arrangement
3. **Play**: Click pieces to select them, then click valid move squares to move
4. **Adjust Settings**: Use the settings menu to change AI difficulty and vision radius

## 🎮 How to Play

### Basic Rules
- **Player 1** (Blue) moves first from the bottom of the board
- **Player 2** (Red) plays as AI or second player from the top
- **Pieces move** according to chess-like rules (customizable)
- **Victory** is achieved by capturing the enemy King or eliminating all pieces

### Hidden Information System

**Vision System:**
- You always see your own pieces
- You see enemy pieces only after they're revealed
- Revealed enemy pieces remain visible
- Pieces within your vision radius are visible (configurable)
- Hidden enemy pieces appear as "?" tokens

**Piece Revelation:**
- Enemy piece reveals when it **attacks**
- Enemy piece reveals when it's **attacked**
- Piece reveals when it **moves** into your vision

## 🏗️ Project Architecture

### File Structure
```
strategy-game/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styling and animations
├── js/
│   ├── config.js          # Game configuration constants
│   ├── board.js           # Board state management
│   ├── piece.js           # Base piece class
│   ├── pieces/
│   │   ├── pawn.js        # Pawn piece
│   │   ├── knight.js      # Knight piece
│   │   ├── bishop.js      # Bishop piece
│   │   ├── rook.js        # Rook piece
│   │   ├── queen.js       # Queen piece
│   │   └── king.js        # King piece
│   ├── rules.js           # Game rules engine
│   ├── visionSystem.js    # Fog-of-war implementation
│   ├── renderer.js        # Canvas rendering
│   ├── ai.js              # AI opponent system
│   ├── gameState.js       # Central game state
│   ├── ui.js              # UI event handling
│   └── main.js            # Entry point
└── README.md              # This file
```

### Architecture Highlights

**Modular Design:**
- Each piece type is a separate class extending `Piece`
- Rules engine is independent from rendering
- Vision system is decoupled from game logic
- UI layer manages only user interaction

**Extensible:**
- Add new piece types by creating a class in `pieces/`
- Modify movement rules in individual piece files
- Customize board size and other settings in `config.js`
- Easy to add new AI difficulty levels

**Clean Separation of Concerns:**
- **Board** manages piece positions
- **Rules** validates moves and checks win conditions
- **VisionSystem** handles fog-of-war
- **Renderer** handles all drawing
- **AI** makes intelligent decisions
- **UI** handles user input

## ⚙️ Configuration

Edit `js/config.js` to customize:

```javascript
// Board size
BOARD_SIZE: 8
CELL_SIZE: 100

// Vision radius (fog-of-war)
VISION_RADIUS: 4

// AI difficulty
AI_DIFFICULTY: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
}

// Win conditions
WIN_CONDITION.CAPTURE_KING    // Capture enemy king
WIN_CONDITION.ELIMINATE_ALL   // Eliminate all pieces

// Piece values (for AI evaluation)
PIECE_VALUES: {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 999
}
```

## 🎨 Customization

### Add New Piece Type

1. Create `js/pieces/newpiece.js`:
```javascript
class NewPiece extends Piece {
    constructor(owner, x, y) {
        super(CONFIG.PIECE_TYPES.NEWPIECE, owner, x, y);
    }

    getValidMoves(board) {
        // Implement movement logic
        const moves = [];
        // ...
        return moves;
    }
}
```

2. Add to `config.js`:
```javascript
PIECE_TYPES: {
    NEWPIECE: 'newpiece',
    // ...
},

PIECE_SYMBOLS: {
    newpiece: '♞', // Unicode symbol
    // ...
}
```

3. Update initial setup in `js/gameState.js`

### Change Colors

Edit CSS variables in `styles/main.css`:
```css
:root {
    --primary-color: #2563eb;
    --board-light: #f0e6d2;
    --board-dark: #d4a574;
    --highlight-color: #fbbf24;
    /* ... more colors ... */
}
```

### Modify AI Strategy

Edit `js/ai.js`:
- Adjust `AI_DEPTH` for difficulty
- Modify `evaluatePosition()` for different strategies
- Change `evaluatePositions()` for piece positioning preferences

## 🔮 Future Features

The architecture is designed to easily support:

- ✨ **Special Abilities** - Custom piece powers
- 🎯 **Spells & Traps** - New game mechanics
- 🗺️ **Larger Boards** - 10×10, 12×12, etc.
- 👥 **Multiplayer** - Two players on same device
- 🌐 **Online Play** - WebSocket-based multiplayer
- 📊 **Ranking System** - Player statistics and ratings
- 🎬 **Replay Mode** - Watch past games
- 🗺️ **Custom Maps** - Different board layouts
- 📱 **Mobile App** - Native mobile version

## 🎓 Technical Details

### Technologies
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **JavaScript ES6+** - Object-oriented architecture
- **Canvas API** - Board rendering
- **No External Dependencies** - Pure vanilla implementation

### Browser Support
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- Optimized AI with configurable depth
- Efficient board state management
- Canvas-based rendering for smooth animations
- Minimal DOM manipulation

## 📖 Game Rules

### Piece Movements

**Pawn:**
- Moves forward 1 square (2 squares on first move)
- Captures diagonally forward
- No backward moves

**Knight:**
- Moves in L-shape: 2 squares in one direction, 1 perpendicular
- Jumps over other pieces

**Bishop:**
- Moves diagonally any number of squares
- Cannot jump over pieces

**Rook:**
- Moves horizontally or vertically any number of squares
- Cannot jump over pieces

**Queen:**
- Combines Rook and Bishop movements
- Moves horizontally, vertically, or diagonally

**King:**
- Moves one square in any direction
- Most important piece (game ends if captured)

### Win Conditions
- **Capture King** - Primary win condition
- **Eliminate All** - Alternative win condition
- **Stalemate** - Draw (no legal moves)

## 🐛 Debugging

Enable debug output in console:
```javascript
// View board state
gameState.board.getBoardState();

// Check visibility
gameState.visionSystem.getVisibilityDebug(CONFIG.PLAYERS.PLAYER1);

// View legal moves
gameState.rules.getLegalMovesForPlayer(CONFIG.PLAYERS.PLAYER1);
```

## 📝 License

MIT License - Feel free to use, modify, and distribute

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 👨‍💻 Author

Created by [shixnazarov09](https://github.com/shixnazarov09)

## 🎉 Acknowledgments

Inspired by chess variants and hidden information games like Stratego, focusing on strategy and deduction rather than memorization.

---

**Enjoy the game! May your strategy be sharp and your deductions true.** ♟️
