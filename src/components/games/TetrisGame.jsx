import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/games.css';

const ROWS = 20;
const COLS = 10;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const COLORS = ['#00f5ff', '#ffd700', '#da70d6', '#ff8c00', '#1e90ff', '#00ff00', '#ff0000'];

const TetrisGame = () => {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('tetrisHighScore')) || 0);

  const createPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: shapeIndex + 1,
    };
  }, []);

  const checkCollision = useCallback((piece, pos, newBoard = board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newY = pos.y + y;
          const newX = pos.x + x;
          if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && newBoard[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });

    let linesCleared = 0;
    const clearedBoard = newBoard.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (clearedBoard.length < ROWS) {
      clearedBoard.unshift(Array(COLS).fill(0));
    }

    setBoard(clearedBoard);
    setLines(prev => prev + linesCleared);
    setScore(prev => prev + linesCleared * 100 * level);

    if (linesCleared > 0 && (lines + linesCleared) % 10 === 0) {
      setLevel(prev => prev + 1);
    }

    const newPiece = createPiece();
    const newPos = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (checkCollision(newPiece, newPos, clearedBoard)) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('tetrisHighScore', score.toString());
      }
    } else {
      setCurrentPiece(newPiece);
      setPosition(newPos);
    }
  }, [board, currentPiece, position, score, level, lines, createPiece, checkCollision, highScore]);

  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || gameOver || !isPlaying) return;

    const newPos = { x: position.x + dx, y: position.y + dy };

    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    } else if (dy > 0) {
      mergePiece();
    }
  }, [currentPiece, position, gameOver, isPlaying, checkCollision, mergePiece]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || !isPlaying) return;

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );

    const rotatedPiece = { ...currentPiece, shape: rotated };

    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, gameOver, isPlaying, checkCollision]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || !isPlaying) return;

    let newY = position.y;
    while (!checkCollision(currentPiece, { ...position, y: newY + 1 })) {
      newY++;
    }
    setPosition({ ...position, y: newY });
    mergePiece();
  }, [currentPiece, position, gameOver, isPlaying, checkCollision, mergePiece]);

  const startGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    const piece = createPiece();
    setCurrentPiece(piece);
    setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, Math.max(100, 1000 - level * 100));

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, level, movePiece]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          e.preventDefault();
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          e.preventDefault();
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          e.preventDefault();
          break;
        case 'ArrowUp':
          rotatePiece();
          e.preventDefault();
          break;
        case ' ':
          dropPiece();
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, movePiece, rotatePiece, dropPiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece && !gameOver) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title">🧱 Tetris</h1>
          <p className="games-subtitle">Stack the blocks and clear lines!</p>
        </div>

        <div className="game-stats">
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Lines</span>
            <span className="stat-value">{lines}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{highScore}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div className="tetris-board">
            {renderBoard().map((row, y) => (
              <div key={y} className="tetris-row">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="tetris-cell"
                    style={{
                      backgroundColor: cell ? COLORS[cell - 1] : 'transparent',
                      border: cell ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Lines Cleared: {lines}</p>
                {score === highScore && score > 0 && (
                  <p className="new-high-score">🎉 New High Score!</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="game-controls">
          {!isPlaying && (
            <button className="game-btn primary" onClick={startGame}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          )}
          {isPlaying && !gameOver && (
            <button className="game-btn secondary" onClick={() => setIsPlaying(false)}>
              Pause
            </button>
          )}
          {!isPlaying && !gameOver && score > 0 && (
            <button className="game-btn primary" onClick={() => setIsPlaying(true)}>
              Resume
            </button>
          )}
        </div>

        <div className="game-instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Use <strong>Arrow Left/Right</strong> to move pieces</li>
            <li>Use <strong>Arrow Up</strong> to rotate pieces</li>
            <li>Use <strong>Arrow Down</strong> to move faster</li>
            <li>Press <strong>Space</strong> to drop instantly</li>
            <li>Clear lines to score points and level up!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
