import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

interface LeaderboardUser {
  id: number;
  username: string;
  points: number;
  rank: number;
  avatar: string | null;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    // Mock data - replace with API call
    setLeaderboard([
      { id: 1, username: 'techmaster', points: 1250, rank: 1, avatar: null },
      { id: 2, username: 'codewiz', points: 980, rank: 2, avatar: null },
      { id: 3, username: 'hardwarehero', points: 875, rank: 3, avatar: null },
      { id: 4, username: 'iotexpert', points: 720, rank: 4, avatar: null },
      { id: 5, username: 'embeddedengineer', points: 650, rank: 5, avatar: null },
      { id: 6, username: 'robotbuilder', points: 580, rank: 6, avatar: null },
      { id: 7, username: 'circuitmaster', points: 520, rank: 7, avatar: null },
      { id: 8, username: 'codeninjas', points: 480, rank: 8, avatar: null },
    ]);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="gold" />;
      case 2:
        return <FaMedal className="silver" />;
      case 3:
        return <FaAward className="bronze" />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  return (
    <div className="leaderboard">
      <div className="container">
        <h1>Leaderboard</h1>

        <div className="timeframe-selector">
          {['all', 'monthly', 'weekly'].map((period) => (
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
          {leaderboard.map((user) => (
            <div key={user.id} className={`leaderboard-item rank-${user.rank}`}>
              <div className="rank-icon">{getRankIcon(user.rank)}</div>

              <div className="user-info">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="avatar" />
                ) : (
                  <div className="avatar avatar-placeholder">
                    <FiUser />
                  </div>
                )}
                <span className="username">{user.username}</span>
              </div>

              <div className="points">{user.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
