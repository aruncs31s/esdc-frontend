# 🎮 Games Hub - Classic Arcade Games Collection

Welcome to the ESDC Games Hub! A collection of classic arcade games built with React.

## 🕹️ Available Games

### 1. 🐍 Snake (1976)
- **Difficulty:** Easy
- **Players:** 1 Player
- **Controls:** Arrow Keys
- Classic snake game where you eat food to grow longer and avoid hitting yourself
- Game speeds up as you score more points
- Persistent high score tracking

### 2. 🧱 Tetris (1984)
- **Difficulty:** Medium
- **Players:** 1 Player
- **Controls:** 
  - Arrow Left/Right: Move pieces
  - Arrow Up: Rotate pieces
  - Arrow Down: Move faster
  - Space: Drop instantly
- Stack falling blocks to clear lines
- Increases difficulty every 10 lines cleared
- Persistent high score tracking

### 3. 🏓 Pong (1972)
- **Difficulty:** Easy
- **Players:** 1-2 Players
- **Controls:** Mouse movement or Arrow Up/Down
- The original arcade game - bounce the ball past the AI opponent
- First to 5 points wins
- AI difficulty adapts to ball position

### 4. 🎯 Breakout (1976)
- **Difficulty:** Medium
- **Players:** 1 Player
- **Controls:** Mouse movement or Arrow Left/Right
- Break all the bricks with your paddle and ball
- 3 lives to complete the level
- Colorful brick patterns with increasing difficulty

### 5. 🧠 Memory Match (1959)
- **Difficulty:** Easy
- **Players:** 1 Player
- **Controls:** Mouse clicks
- Test your memory by matching pairs of emoji cards
- Track your moves and time
- Beat your best time and move count

### 6. 🎵 Simon Says (1978)
- **Difficulty:** Medium
- **Players:** 1 Player
- **Controls:** Mouse clicks
- Remember and repeat the pattern of lights and sounds
- Sequences get longer each round
- Game speeds up as you progress
- Web Audio API for authentic sounds

## 🎨 Features

- **Modern UI:** Beautiful gradient-based card design for the games hub
- **Dark Mode Support:** All games support both light and dark themes
- **Responsive Design:** Fully functional on desktop, tablet, and mobile devices
- **Score Persistence:** High scores and best times saved in localStorage
- **Smooth Animations:** Polished animations and visual feedback
- **Accessible Controls:** Multiple control methods (keyboard, mouse)
- **Sound Effects:** Simon Says includes authentic audio feedback

## 📁 File Structure

```
src/
├── pages/
│   └── Games.jsx                 # Games hub with card grid
├── components/
│   └── games/
│       ├── SnakeGame.jsx        # Snake game component
│       ├── TetrisGame.jsx       # Tetris game component
│       ├── PongGame.jsx         # Pong game component
│       ├── BreakoutGame.jsx     # Breakout game component
│       ├── MemoryGame.jsx       # Memory Match game component
│       └── SimonGame.jsx        # Simon Says game component
└── styles/
    └── games.css                 # All game styles
```

## 🚀 Routes

- `/games` - Games hub (card grid with all games)
- `/games/snake` - Snake game
- `/games/tetris` - Tetris game
- `/games/pong` - Pong game
- `/games/breakout` - Breakout game
- `/games/memory` - Memory Match game
- `/games/simon` - Simon Says game

## 🎯 Usage

Users can access the games through:
1. Click "Games" in the navigation bar
2. Browse the games hub showing all available games as cards
3. Click on any game card to play
4. Use the "Back to Games" button to return to the hub

## 🛠️ Technical Details

- **React Hooks:** useState, useEffect, useCallback, useRef
- **React Router:** Dynamic routing for each game
- **LocalStorage:** Persistent score tracking
- **Web Audio API:** Sound effects for Simon Says
- **CSS Grid & Flexbox:** Responsive layouts
- **CSS Animations:** Smooth transitions and effects

## 📱 Responsive Breakpoints

- **Desktop:** Full size (1200px+)
- **Tablet:** Scaled layouts (768px - 1199px)
- **Mobile:** Optimized for small screens (< 768px)

## 🎨 Color Schemes

Each game has its own unique gradient theme:
- Snake: Purple/Violet gradient
- Tetris: Pink/Red gradient
- Pong: Blue/Cyan gradient
- Breakout: Green/Cyan gradient
- Memory: Pink/Yellow gradient
- Simon: Cyan/Purple gradient

## 🏆 High Score Storage

High scores are stored in localStorage with the following keys:
- `snakeHighScore`
- `tetrisHighScore`
- `breakoutHighScore`
- `memoryBestTime`
- `memoryBestMoves`
- `simonHighScore`

## 📝 Future Enhancements

Potential additions:
- Multiplayer support for Pong
- Level editor for custom Tetris challenges
- More game variations (Space Invaders, Pac-Man, etc.)
- Leaderboard integration with backend
- Achievement system
- Game statistics and analytics
- Sound effects for all games
- Custom themes and skins

## 🎮 Enjoy Gaming!

Have fun playing these classic arcade games and try to beat your high scores!
