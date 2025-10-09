import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GiMusicalNotes } from 'react-icons/gi';
import { FaTrophy } from 'react-icons/fa';
import '../../styles/games.css';

const COLORS = [
  { name: 'green', color: '#00ff00' },
  { name: 'red', color: '#ff0000' },
  { name: 'yellow', color: '#ffff00' },
  { name: 'blue', color: '#0000ff' },
];

const SimonGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('simonHighScore')) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(600);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || window.AudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (frequency, duration = 300) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  const frequencies = {
    0: 329.63, // E4 - green
    1: 261.63, // C4 - red
    2: 392.00, // G4 - yellow
    3: 493.88, // B4 - blue
  };

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setUserSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setSpeed(600);
    setTimeout(() => showSequence(newSequence), 500);
  };

  const showSequence = async (seq) => {
    setIsShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(seq[i]);
      playSound(frequencies[seq[i]]);
      await new Promise(resolve => setTimeout(resolve, speed));
      setActiveButton(null);
    }
    
    setIsShowingSequence(false);
  };

  const handleButtonClick = (index) => {
    if (!isPlaying || isShowingSequence || gameOver) return;

    setActiveButton(index);
    playSound(frequencies[index], 200);
    setTimeout(() => setActiveButton(null), 200);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if correct
    if (sequence[newUserSequence.length - 1] !== index) {
      // Wrong!
      setGameOver(true);
      setIsPlaying(false);
      playSound(100, 500); // Error sound
      
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simonHighScore', score.toString());
      }
      return;
    }

    // Check if sequence complete
    if (newUserSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setUserSequence([]);
      
      // Increase difficulty
      if (newScore % 5 === 0) {
        setSpeed(prev => Math.max(200, prev - 50));
      }

      // Add new step
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      
      setTimeout(() => showSequence(newSequence), 1000);
    }
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <Link to="/games" className="back-button">
          ← Back to Games
        </Link>

        <div className="games-header">
          <h1 className="games-title"><GiMusicalNotes /> Simon Says</h1>
          <p className="games-subtitle">Remember and repeat the pattern!</p>
        </div>

        <div className="game-stats simon-stats">
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Round</span>
            <span className="stat-value">{sequence.length}</span>
          </div>
        </div>

        <div className="game-board-container">
          <div className="simon-board">
            <div className="simon-grid">
              {COLORS.map((color, index) => (
                <button
                  key={color.name}
                  className={`simon-button simon-${color.name} ${
                    activeButton === index ? 'active' : ''
                  } ${!isPlaying || isShowingSequence || gameOver ? 'disabled' : ''}`}
                  style={{
                    backgroundColor: activeButton === index 
                      ? color.color 
                      : `${color.color}80`,
                  }}
                  onClick={() => handleButtonClick(index)}
                  disabled={!isPlaying || isShowingSequence || gameOver}
                />
              ))}
            </div>
            
            <div className="simon-center">
              <div className="simon-logo">SIMON</div>
              {isShowingSequence && (
                <div className="simon-status">Watch...</div>
              )}
              {isPlaying && !isShowingSequence && !gameOver && (
                <div className="simon-status">Your Turn!</div>
              )}
            </div>
          </div>

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-content">
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Sequence Length: {sequence.length}</p>
                {score === highScore && score > 0 && (
                  <p className="new-high-score"><FaTrophy /> New High Score!</p>
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
        </div>

        <div className="game-instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Watch the sequence of lights and sounds</li>
            <li><strong>Click</strong> the buttons in the same order</li>
            <li>Each round adds one more step to the sequence</li>
            <li>The game gets faster as you progress!</li>
            <li>One mistake and it's game over!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimonGame;
