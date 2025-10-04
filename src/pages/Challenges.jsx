import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaTrophy, FaClock, FaCode, FaDownload } from 'react-icons/fa';

const Challenges = () => {
  const { isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
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
    console.log('Submitting solution for:', challengeId);
  };

  const filteredChallenges = challenges.filter(c => 
    filter === 'all' || c.difficulty.toLowerCase() === filter
  );

  return (
    <section className="challenges-page">
      <div className="container">
        <div className="section-header">
          <h2>Coding Challenges</h2>
          <p>Test your skills with hands-on embedded systems challenges</p>
        </div>
        
        <div className="filter-tabs">
          {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button 
              key={level}
              className={`filter-btn ${filter === level ? 'active' : ''}`}
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
                <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p>{challenge.description}</p>
              
              <div className="challenge-meta">
                <div className="meta-item">
                  <FaTrophy /> <span>{challenge.points} points</span>
                </div>
                <div className="meta-item">
                  <FaClock /> <span>Due: {challenge.deadline}</span>
                </div>
              </div>

              {isAuthenticated && (
                <div className="challenge-actions">
                  <button className="btn btn-secondary btn-sm">
                    <FaDownload /> Download Kit
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => submitSolution(challenge.id)}>
                    <FaCode /> Submit Solution
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Challenges;