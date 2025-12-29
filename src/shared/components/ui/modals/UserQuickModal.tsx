import BaseModal from './BaseModal';
import { UserData } from '@/types/user';
import {
  FaEnvelope,
  FaGithub,
  FaMapPin,
  FaBriefcase,
  FaLink,
  FaCalendar,
  FaUser,
} from 'react-icons/fa';
import '../../../../styles/UserQuickModal.css';

interface UserQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onViewFullProfile: (userId: string) => void;
}

/**
 * Quick preview modal for team members
 * Shows basic info with option to view full profile
 */
const UserQuickModal = ({ isOpen, onClose, user, onViewFullProfile }: UserQuickModalProps) => {
  const handleViewFullProfile = () => {
    if (user.id) {
      onViewFullProfile(user.id);
      onClose(); // Close the quick modal
    }
  };

  const getAvatarUrl = () => {
    return (
      user.avatar_url ||
      user.avatarUrl ||
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=random`
    );
  };

  const getDisplayName = () => {
    return user.name || user.username || user.login || 'Unknown User';
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Team Member" size="medium">
      <div className="user-quick-modal-content">
        {/* Avatar and Basic Info */}
        <div className="user-quick-header">
          <div className="user-quick-avatar">
            <img src={getAvatarUrl()} alt={getDisplayName()} />
          </div>
          <div className="user-quick-info">
            <h2>{getDisplayName()}</h2>
            <p className="user-quick-username">@{user.username || user.login || 'username'}</p>
            {user.role && (
              <span className={`user-quick-role role-${user.role.toLowerCase()}`}>{user.role}</span>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="user-quick-bio">
            <p>{user.bio}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="user-quick-details">
          <h3>Contact Information</h3>
          <div className="details-grid">
            {user.email && (
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </div>
            )}

            {user.location && (
              <div className="detail-item">
                <FaMapPin className="detail-icon" />
                <span>{user.location}</span>
              </div>
            )}

            {user.company && (
              <div className="detail-item">
                <FaBriefcase className="detail-icon" />
                <span>{user.company}</span>
              </div>
            )}

            {user.blog && (
              <div className="detail-item">
                <FaLink className="detail-icon" />
                <a href={user.blog} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </div>
            )}

            {(user.github_username || user.html_url) && (
              <div className="detail-item">
                <FaGithub className="detail-icon" />
                <a
                  href={user.html_url || `https://github.com/${user.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{user.github_username || user.username}
                </a>
              </div>
            )}

            {(user.created_at || user.createdAt) && (
              <div className="detail-item">
                <FaCalendar className="detail-icon" />
                <span>
                  Joined{' '}
                  {new Date(user.created_at || user.createdAt || '').toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="user-quick-actions">
          <button className="btn-view-full-profile" onClick={handleViewFullProfile}>
            <FaUser />
            <span>See Full Profile</span>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UserQuickModal;
