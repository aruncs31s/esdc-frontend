import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import '../styles/roadmap.css';

export default function Roadmap() {
  const phases = [
    {
      title: 'Q1 2025',
      status: 'completed',
      items: ['User Authentication', 'Dashboard', 'Projects'],
    },
    {
      title: 'Q2 2025',
      status: 'in-progress',
      items: ['Team Collaboration', 'Analytics', 'Integrations'],
    },
    {
      title: 'Q3 2025',
      status: 'planned',
      items: ['Mobile App', 'AI Features', 'Advanced Reports'],
    },
    {
      title: 'Q4 2025',
      status: 'planned',
      items: ['API v2', 'Marketplace', 'Enterprise Features'],
    },
  ];

  return (
    <div className="roadmap-page">
      <div className="container">
        <h1>Product Roadmap</h1>
        <p>Our vision for the future</p>

        <div className="roadmap-timeline">
          {phases.map((phase, idx) => (
            <div key={idx} className={`roadmap-phase ${phase.status}`}>
              <div className="phase-icon">
                {phase.status === 'completed' && <FiCheckCircle size={24} />}
                {phase.status === 'in-progress' && <FiClock size={24} />}
                {phase.status === 'planned' && <FiCircle size={24} />}
              </div>
              <div className="phase-content">
                <h3>{phase.title}</h3>
                <ul>
                  {phase.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
