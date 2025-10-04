import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaTrophy, FaClock, FaCode, FaDownload } from 'react-icons/fa';

const Challenges = () => {
  const { isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    // Mock data - replace with API call
    setChallenges([
      {
        id: 1,
        title: 'LED Matrix Display',
        difficulty: 'Beginner',
        points: 100,
        deadline: '2025-03-01',
        description: 'Create a scrolling text display using LED matrix',
        status: 'active'
      },
      {
        id: 2,
        title: 'IoT Weather Station',
        difficulty: 'Intermediate',
        points: 250,
        deadline: '2025-03-15',
        description: 'Build a weather monitoring system with web dashboard',
        status: 'active'
      }
    ]);
  };

  const submitSolution = async (challengeId) => {
    // API call to submit solution
    console.log('Submitting solution for:', challengeId);
  };

  const filteredChallenges = challenges.filter(c => 
    filter === 'all' || c.difficulty.toLowerCase() === filter
  );

  return (
    <div className="challenges-page">
      <div className="container">
        <h1>Coding Challenges</h1>
        
        <div className="filter-tabs">
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button 
              key={level}
              className={filter === level ? 'active' : ''}
              onClick={() => setFilter(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className="challenges-grid">
          {filteredChallenges.map(challenge => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-header">
                <h3>{challenge.title}</h3>
                <span className={`difficulty ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p>{challenge.description}</p>
              
              <div className="challenge-meta">
                <div><FaTrophy /> {challenge.points} points</div>
                <div><FaClock /> Due: {challenge.deadline}</div>
              </div>

              {isAuthenticated && (
                <div className="challenge-actions">
                  <button><FaDownload /> Download Kit</button>
                  <button onClick={() => submitSolution(challenge.id)}>
                    <FaCode /> Submit Solution
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenges;