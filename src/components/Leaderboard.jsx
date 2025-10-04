import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    // Mock data - replace with API call
    setLeaderboard([
      { id: 1, username: 'techmaster', points: 1250, rank: 1, avatar: '/avatars/1.jpg' },
      { id: 2, username: 'codewiz', points: 980, rank: 2, avatar: '/avatars/2.jpg' },
      { id: 3, username: 'hardwarehero', points: 875, rank: 3, avatar: '/avatars/3.jpg' },
      { id: 4, username: 'iotexpert', points: 720, rank: 4, avatar: '/avatars/4.jpg' },
      { id: 5, username: 'embeddedengineer', points: 650, rank: 5, avatar: '/avatars/5.jpg' }
    ]);
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <FaTrophy className="gold" />;
      case 2: return <FaMedal className="silver" />;
      case 3: return <FaAward className="bronze" />;
      default: return <span className="rank-number">#{rank}</span>;
    }
  };

  return (
    <div className="leaderboard">
      <div className="container">
        <h1>Leaderboard</h1>
        
        <div className="timeframe-selector">
          {['all', 'monthly', 'weekly'].map(period => (
            <button 
              key={period}
              className={timeframe === period ? 'active' : ''}
              onClick={() => setTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        <div className="leaderboard-list">
          {leaderboard.map(user => (
            <div key={user.id} className={`leaderboard-item rank-${user.rank}`}>
              <div className="rank-icon">
                {getRankIcon(user.rank)}
              </div>
              
              <div className="user-info">
                <img src={user.avatar} alt={user.username} className="avatar" />
                <span className="username">{user.username}</span>
              </div>
              
              <div className="points">
                {user.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;