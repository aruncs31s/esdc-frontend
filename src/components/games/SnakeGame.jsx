import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/games.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(INITIAL_SPEED);
  };

  const checkCollision = useCallback((head, snakeBody) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          setScore((prevScore) => prevScore + 10);
          setSpeed((prevSpeed) => Math.max(50, prevSpeed - 2));
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, generateFood, checkCollision, score, highScore, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      const key = e.key;
      const currentDir = directionRef.current;

      switch (key) {
        case 'ArrowUp':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: -1 });
          }
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (currentDir.y === 0) {
            setDirection({ x: 0, y: 1 });
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (currentDir.x === 0) {
            setDirection({ x: -1, y: 0 });
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (currentDir.x === 0) {
            setDirection({ x: 1, y: 0 });
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title">🐍 Snake Game</h1>
          <p className="games-subtitle">Classic arcade fun! Use arrow keys to control the snake.</p>
        </div>

        <div className="game-stats">
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Length</span>
            <span className="stat-value">{snake.length}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div
            className="game-board"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`cell ${isSnake ? 'snake' : ''} ${isHead ? 'snake-head' : ''} ${
                    isFood ? 'food' : ''
                  }`}
                />
              );
            })}
          </div>

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                {score === highScore && score > 0 && (
                  <p className="new-high-score">🎉 New High Score!</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="game-controls">
          {!isPlaying && !gameOver && (
            <button className="game-btn primary" onClick={resetGame}>
              Start Game
            </button>
          )}
          {isPlaying && (
            <button className="game-btn secondary" onClick={() => setIsPlaying(false)}>
              Pause
            </button>
          )}
          {!isPlaying && gameOver && (
            <button className="game-btn primary" onClick={resetGame}>
              Play Again
            </button>
          )}
          {!isPlaying && !gameOver && snake.length > 1 && (
            <button className="game-btn primary" onClick={() => setIsPlaying(true)}>
              Resume
            </button>
          )}
        </div>

        <div className="game-instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Use <strong>Arrow Keys</strong> to control the snake</li>
            <li>Eat the red food to grow longer and score points</li>
            <li>Don't hit the walls or yourself!</li>
            <li>The game speeds up as you score more points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
