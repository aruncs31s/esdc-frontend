import { FiGithub, FiSlack, FiMail, FiCloud } from 'react-icons/fi';
import '../styles/integrations.css';

export default function Integrations() {
  const integrations = [
    {
      name: 'GitHub',
      icon: FiGithub,
      connected: true,
      description: 'Sync repositories and issues',
    },
    { name: 'Slack', icon: FiSlack, connected: false, description: 'Team notifications' },
    { name: 'Email', icon: FiMail, connected: true, description: 'Email notifications' },
    { name: 'Cloud Storage', icon: FiCloud, connected: false, description: 'File storage' },
  ];

  return (
    <div className="integrations-page">
      <div className="container">
        <h1>Integrations</h1>
        <p>Connect your favorite tools</p>

        <div className="integrations-grid">
          {integrations.map((int) => (
            <div key={int.name} className="integration-card">
              <div className="integration-icon">
                <int.icon size={40} />
              </div>
              <h3>{int.name}</h3>
              <p>{int.description}</p>
              <button className={`btn-${int.connected ? 'secondary' : 'primary'}`}>
                {int.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
