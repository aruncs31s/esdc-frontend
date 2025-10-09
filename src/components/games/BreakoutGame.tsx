import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GiBreakingChain } from 'react-icons/gi';
import { FaTrophy } from 'react-icons/fa';
import '../../styles/games.css';

const BreakoutGame = () => {
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 500;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 15;
  const BALL_SIZE = 12;
  const BRICK_ROWS = 5;
  const BRICK_COLS = 10;
  const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLS;
  const BRICK_HEIGHT = 25;

  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ballX, setBallX] = useState(CANVAS_WIDTH / 2);
  const [ballY, setBallY] = useState(CANVAS_HEIGHT - 100);
  const [ballVelocityX, setBallVelocityX] = useState(4);
  const [ballVelocityY, setBallVelocityY] = useState(-4);
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('breakoutHighScore')) || 0);

  const initBricks = useCallback(() => {
    const newBricks = [];
    const colors = ['#ff6b6b', '#f06595', '#cc5de8', '#845ef7', '#5c7cfa'];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * BRICK_WIDTH,
          y: row * BRICK_HEIGHT + 50,
          width: BRICK_WIDTH - 2,
          height: BRICK_HEIGHT - 2,
          color: colors[row],
          hits: 1,
          visible: true,
        });
      }
    }
    return newBricks;
  }, [BRICK_WIDTH]);

  const resetBall = useCallback(() => {
    setBallX(CANVAS_WIDTH / 2);
    setBallY(CANVAS_HEIGHT - 100);
    setBallVelocityX(4 * (Math.random() > 0.5 ? 1 : -1));
    setBallVelocityY(-4);
  }, []);

  const updateGame = useCallback(() => {
    // Move ball
    setBallX(prevX => prevX + ballVelocityX);
    setBallY(prevY => prevY + ballVelocityY);

    // Ball collision with walls
    if (ballX <= 0 || ballX >= CANVAS_WIDTH - BALL_SIZE) {
      setBallVelocityX(prev => -prev);
    }

    if (ballY <= 0) {
      setBallVelocityY(prev => -prev);
    }

    // Ball collision with paddle
    if (
      ballY >= CANVAS_HEIGHT - PADDLE_HEIGHT - 30 - BALL_SIZE &&
      ballY <= CANVAS_HEIGHT - PADDLE_HEIGHT - 30 &&
      ballX >= paddleX &&
      ballX <= paddleX + PADDLE_WIDTH
    ) {
      setBallVelocityY(prev => -Math.abs(prev));
      const hitPos = (ballX - paddleX) / PADDLE_WIDTH;
      setBallVelocityX((hitPos - 0.5) * 10);
    }

    // Ball collision with bricks
    setBricks(prevBricks => {
      let newBricks = [...prevBricks];
      let scoreIncrease = 0;

      newBricks.forEach((brick, index) => {
        if (
          brick.visible &&
          ballX >= brick.x &&
          ballX <= brick.x + brick.width &&
          ballY >= brick.y &&
          ballY <= brick.y + brick.height
        ) {
          newBricks[index] = { ...brick, visible: false };
          setBallVelocityY(prev => -prev);
          scoreIncrease += 10;
        }
      });

      if (scoreIncrease > 0) {
        setScore(prev => prev + scoreIncrease);
      }

      // Check win condition
      if (newBricks.every(brick => !brick.visible)) {
        setWon(true);
        setGameOver(true);
        setIsPlaying(false);
        if (score + scoreIncrease > highScore) {
          setHighScore(score + scoreIncrease);
          localStorage.setItem('breakoutHighScore', (score + scoreIncrease).toString());
        }
      }

      return newBricks;
    });

    // Ball falls off bottom
    if (ballY >= CANVAS_HEIGHT) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('breakoutHighScore', score.toString());
          }
        } else {
          resetBall();
        }
        return newLives;
      });
    }
  }, [ballX, ballY, ballVelocityX, ballVelocityY, paddleX, score, highScore, resetBall]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, updateGame]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;
      
      if (e.key === 'ArrowLeft') {
        setPaddleX(prev => Math.max(0, prev - 30));
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPaddleX(prev => Math.min(CANVAS_WIDTH - PADDLE_WIDTH, prev + 30));
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setBricks(initBricks());
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    resetBall();
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setIsPlaying(true);
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title"><GiBreakingChain /> Breakout</h1>
          <p className="games-subtitle">Break all the bricks to win!</p>
        </div>

        <div className="game-stats">
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Lives</span>
            <span className="stat-value">{lives}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{highScore}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div
            className="breakout-canvas"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            onMouseMove={(e) => {
              if (!isPlaying || gameOver) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              setPaddleX(Math.max(0, Math.min(mouseX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH)));
            }}
          >
            {/* Bricks */}
            {bricks.map((brick, index) => (
              brick.visible && (
                <div
                  key={index}
                  className="breakout-brick"
                  style={{
                    left: brick.x,
                    top: brick.y,
                    width: brick.width,
                    height: brick.height,
                    backgroundColor: brick.color,
                  }}
                />
              )
            ))}
            
            {/* Paddle */}
            <div
              className="breakout-paddle"
              style={{
                left: paddleX,
                bottom: 30,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
              }}
            />
            
            {/* Ball */}
            <div
              className="breakout-ball"
              style={{
                left: ballX,
                top: ballY,
                width: BALL_SIZE,
                height: BALL_SIZE,
              }}
            />

            {gameOver && (
              <div className="game-over-overlay">
                <div className="game-over-content">
                  <h2>{won ? <><FaTrophy /> You Win!</> : 'Game Over!'}</h2>
                  <p>Final Score: {score}</p>
                  {score === highScore && score > 0 && (
                    <p className="new-high-score"><FaTrophy /> New High Score!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="game-controls">
          {!isPlaying && (
            <button className="game-btn primary" onClick={startGame}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          )}
        </div>

        <div className="game-instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Move your <strong>mouse</strong> left and right to control the paddle</li>
            <li>Or use <strong>Arrow Left/Right</strong> keys</li>
            <li>Bounce the ball to break all the bricks</li>
            <li>Don't let the ball fall past your paddle!</li>
            <li>You have 3 lives - make them count!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreakoutGame;
