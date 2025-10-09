import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GiPingPongBat } from 'react-icons/gi';
import '../../styles/games.css';

const PongGame = () => {
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 10;
  const WINNING_SCORE = 5;

  const [playerY, setPlayerY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(CANVAS_WIDTH / 2);
  const [ballY, setBallY] = useState(CANVAS_HEIGHT / 2);
  const [ballVelocityX, setBallVelocityX] = useState(5);
  const [ballVelocityY, setBallVelocityY] = useState(5);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  const resetBall = useCallback(() => {
    setBallX(CANVAS_WIDTH / 2);
    setBallY(CANVAS_HEIGHT / 2);
    setBallVelocityX(prevVx => -prevVx);
    setBallVelocityY((Math.random() - 0.5) * 10);
  }, []);

  const updateGame = useCallback(() => {
    // Move ball
    setBallX(prevX => prevX + ballVelocityX);
    setBallY(prevY => prevY + ballVelocityY);

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
      setBallVelocityY(prev => -prev);
    }

    // Ball collision with paddles
    if (
      ballX <= PADDLE_WIDTH &&
      ballY >= playerY &&
      ballY <= playerY + PADDLE_HEIGHT
    ) {
      setBallVelocityX(prev => Math.abs(prev) + 0.5);
      const relativeIntersectY = (playerY + PADDLE_HEIGHT / 2) - ballY;
      setBallVelocityY(-relativeIntersectY * 0.2);
    }

    if (
      ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
      ballY >= aiY &&
      ballY <= aiY + PADDLE_HEIGHT
    ) {
      setBallVelocityX(prev => -(Math.abs(prev) + 0.5));
      const relativeIntersectY = (aiY + PADDLE_HEIGHT / 2) - ballY;
      setBallVelocityY(-relativeIntersectY * 0.2);
    }

    // AI movement
    setAiY(prevY => {
      const aiCenter = prevY + PADDLE_HEIGHT / 2;
      if (ballX > CANVAS_WIDTH / 2) {
        if (aiCenter < ballY - 35) {
          return Math.min(prevY + 4, CANVAS_HEIGHT - PADDLE_HEIGHT);
        } else if (aiCenter > ballY + 35) {
          return Math.max(prevY - 4, 0);
        }
      }
      return prevY;
    });

    // Score
    if (ballX <= 0) {
      setAiScore(prev => {
        const newScore = prev + 1;
        if (newScore >= WINNING_SCORE) {
          setGameOver(true);
          setIsPlaying(false);
          setWinner('AI');
        }
        return newScore;
      });
      resetBall();
    }

    if (ballX >= CANVAS_WIDTH) {
      setPlayerScore(prev => {
        const newScore = prev + 1;
        if (newScore >= WINNING_SCORE) {
          setGameOver(true);
          setIsPlaying(false);
          setWinner('Player');
        }
        return newScore;
      });
      resetBall();
    }
  }, [ballX, ballY, ballVelocityX, ballVelocityY, playerY, aiY, resetBall]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, updateGame]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;
      
      if (e.key === 'ArrowUp') {
        setPlayerY(prev => Math.max(0, prev - 20));
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setPlayerY(prev => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + 20));
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setPlayerY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBallX(CANVAS_WIDTH / 2);
    setBallY(CANVAS_HEIGHT / 2);
    setBallVelocityX(5);
    setBallVelocityY(5);
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setWinner('');
    setIsPlaying(true);
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title"><GiPingPongBat /> Pong</h1>
          <p className="games-subtitle">The classic arcade game! First to {WINNING_SCORE} wins!</p>
        </div>

        <div className="game-stats pong-stats">
          <div className="stat-card">
            <span className="stat-label">Player</span>
            <span className="stat-value">{playerScore}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">AI</span>
            <span className="stat-value">{aiScore}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div
            className="pong-canvas"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            onMouseMove={(e) => {
              if (!isPlaying || gameOver) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseY = e.clientY - rect.top;
              setPlayerY(Math.max(0, Math.min(mouseY - PADDLE_HEIGHT / 2, CANVAS_HEIGHT - PADDLE_HEIGHT)));
            }}
          >
            {/* Center line */}
            <div className="pong-center-line" />
            
            {/* Player paddle */}
            <div
              className="pong-paddle player-paddle"
              style={{
                left: 0,
                top: playerY,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
              }}
            />
            
            {/* AI paddle */}
            <div
              className="pong-paddle ai-paddle"
              style={{
                right: 0,
                top: aiY,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
              }}
            />
            
            {/* Ball */}
            <div
              className="pong-ball"
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
                  <h2>{winner} Wins!</h2>
                  <p>Final Score: {playerScore} - {aiScore}</p>
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
            <li>Move your <strong>mouse</strong> up and down to control your paddle</li>
            <li>Or use <strong>Arrow Up/Down</strong> keys</li>
            <li>Don't let the ball past your paddle!</li>
            <li>First to reach {WINNING_SCORE} points wins the game</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PongGame;
