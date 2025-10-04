import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/games.css';

const EMOJIS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(parseInt(localStorage.getItem('memoryBestTime')) || 0);
  const [bestMoves, setBestMoves] = useState(parseInt(localStorage.getItem('memoryBestMoves')) || 0);

  const initGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
        
        // Check win condition
        if (matched.length + 2 === cards.length) {
          setGameOver(true);
          setIsPlaying(false);
          
          if (!bestTime || time < bestTime) {
            setBestTime(time);
            localStorage.setItem('memoryBestTime', time.toString());
          }
          if (!bestMoves || moves < bestMoves) {
            setBestMoves(moves);
            localStorage.setItem('memoryBestMoves', moves.toString());
          }
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, cards, matched, time, moves, bestTime, bestMoves]);

  const handleCardClick = (index) => {
    if (!isPlaying || gameOver || flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title">🧠 Memory Match</h1>
          <p className="games-subtitle">Find all matching pairs!</p>
        </div>

        <div className="game-stats">
          <div className="stat-card">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Best Time</span>
            <span className="stat-value">{bestTime ? formatTime(bestTime) : '--'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Best Moves</span>
            <span className="stat-value">{bestMoves || '--'}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div className="memory-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`memory-card ${
                  flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
                } ${matched.includes(index) ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="memory-card-inner">
                  <div className="memory-card-front">?</div>
                  <div className="memory-card-back">{card.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>Congratulations! 🎉</h2>
                <p>Time: {formatTime(time)}</p>
                <p>Moves: {moves}</p>
                {(time === bestTime || moves === bestMoves) && (
                  <p className="new-high-score">🏆 New Record!</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="game-controls">
          {!isPlaying && (
            <button className="game-btn primary" onClick={initGame}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          )}
        </div>

        <div className="game-instructions">
          <h3>How to Play</h3>
          <ul>
            <li><strong>Click</strong> on cards to flip them over</li>
            <li>Find matching pairs of emojis</li>
            <li>Try to match all pairs in the fewest moves</li>
            <li>Beat your best time and move count!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
