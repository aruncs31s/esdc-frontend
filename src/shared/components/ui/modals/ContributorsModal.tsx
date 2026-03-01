import BaseModal from './BaseModal';
import { FaUser, FaEnvelope, FaGithub, FaLinkedin, FaCode } from 'react-icons/fa';
import '../../../../styles/ProjectModals.css';

interface Contributor {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  contributions?: number;
  github_username?: string;
  linkedin?: string;
  avatar?: string;
}

interface ContributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributors: Contributor[];
}
const ContributorsModal = ({ isOpen, onClose, contributors }: ContributorsModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contributors (${contributors.length})`}
      size="large"
    >
      <div className="contributors-modal-content">
        {contributors && contributors.length > 0 ? (
          <div className="contributors-grid">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="contributor-card-modal">
                <div className="contributor-header">
                  <div className="contributor-avatar-large">
                    {contributor.avatar ? (
                      <img src={contributor.avatar} alt={contributor.name} />
                    ) : (
                      contributor.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="contributor-main-info">
                    <h3>{contributor.name}</h3>
                    {contributor.role && (
                      <span className="contributor-role">{contributor.role}</span>
                    )}
                  </div>
                </div>

                <div className="contributor-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <a href={`mailto:${contributor.email}`}>{contributor.email}</a>
                  </div>

                  {contributor.github_username && (
                    <div className="detail-item">
                      <FaGithub className="detail-icon" />
                      <a
                        href={`https://github.com/${contributor.github_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{contributor.github_username}
                      </a>
                    </div>
                  )}

                  {contributor.linkedin && (
                    <div className="detail-item">
                      <FaLinkedin className="detail-icon" />
                      <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {contributor.contributions !== undefined && (
                    <div className="detail-item">
                      <FaCode className="detail-icon" />
                      <span>{contributor.contributions} contributions</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaUser className="empty-icon" />
            <p>No contributors yet</p>
            <span>Be the first to contribute to this project!</span>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ContributorsModal;
