import { Link } from 'react-router-dom';
import { GiSnake, GiBrickWall, GiPingPongBat, GiBreakingChain, GiBrain, GiMusicalNotes, GiGamepad, GiJoystick } from 'react-icons/gi';
import { IoFlash, IoPeople, IoCalendar } from 'react-icons/io5';
import '../styles/games.css';

const Games = () => {
  const games = [
    {
      id: 'snake',
      title: <><GiSnake /> Snake</>,
      description: 'Classic Snake game - eat food, grow longer, and avoid hitting yourself!',
      difficulty: 'Easy',
      players: '1 Player',
      year: '1976',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/games/snake'
    },
    {
      id: 'tetris',
      title: <><GiBrickWall /> Tetris</>,
      description: 'Stack falling blocks to clear lines. A timeless puzzle classic!',
      difficulty: 'Medium',
      players: '1 Player',
      year: '1984',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/games/tetris'
    },
    {
      id: 'pong',
      title: <><GiPingPongBat /> Pong</>,
      description: 'The original arcade game! Bounce the ball past your opponent.',
      difficulty: 'Easy',
      players: '1-2 Players',
      year: '1972',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/games/pong'
    },
    {
      id: 'breakout',
      title: <><GiBreakingChain /> Breakout</>,
      description: 'Break all the bricks with your paddle and ball. Addictive arcade fun!',
      difficulty: 'Medium',
      players: '1 Player',
      year: '1976',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      path: '/games/breakout'
    },
    {
      id: 'memory',
      title: <><GiBrain /> Memory Match</>,
      description: 'Test your memory by matching pairs of cards. How fast can you clear the board?',
      difficulty: 'Easy',
      players: '1 Player',
      year: '1959',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      path: '/games/memory'
    },
    {
      id: 'simon',
      title: <><GiMusicalNotes /> Simon Says</>,
      description: 'Remember and repeat the pattern of lights and sounds. Classic memory game!',
      difficulty: 'Medium',
      players: '1 Player',
      year: '1978',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      path: '/games/simon'
    }
  ];

  return (
    <div className="games-page">
      <div className="games-hub-container">
        <div className="games-header">
          <h1 className="games-title"><GiGamepad /> Classic Arcade Games</h1>
          <p className="games-subtitle">
            Relive the golden age of gaming with these timeless classics!
          </p>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <Link to={game.path} key={game.id} className="game-card-link">
              <div className="game-card" style={{ background: game.color }}>
                <div className="game-card-content">
                  <h2 className="game-card-title">{game.title}</h2>
                  <p className="game-card-description">{game.description}</p>

                  <div className="game-card-meta">
                    <span className="game-meta-item">
                      <span className="meta-icon"><IoFlash /></span>
                      {game.difficulty}
                    </span>
                    <span className="game-meta-item">
                      <span className="meta-icon"><IoPeople /></span>
                      {game.players}
                    </span>
                    <span className="game-meta-item">
                      <span className="meta-icon"><IoCalendar /></span>
                      {game.year}
                    </span>
                  </div>
                </div>

                <div className="game-card-overlay">
                  <span className="play-button">▶ Play Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="games-info">
          <h3><GiJoystick /> About These Games</h3>
          <p>
            These classic games have stood the test of time, entertaining generations of players
            since the dawn of video gaming. Each game offers simple yet addictive gameplay that's
            easy to learn but challenging to master. Whether you're looking for a quick break or
            trying to beat your high score, these retro favorites never get old!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Games;
