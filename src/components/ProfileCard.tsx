import { useState } from 'react';
import { BsGithub, BsPencilSquare, BsCalendar, BsTrophy, BsStar } from 'react-icons/bs';

import PropTypes from 'prop-types';

/**
 * ProfileCard Component
 * A reusable profile card component for displaying user information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing profile information
 * @param {boolean} props.editable - Whether the profile can be edited
 * @param {Function} props.onEdit - Callback function when edit is clicked
 * @param {boolean} props.showStats - Whether to show user statistics
 * @param {Object} props.stats - Statistics object with user metrics
 * @param {string} props.className - Additional CSS classes
 */
// interface ProfileCardStats {
//   points?: number;
//   completedChallenges?: number;
// }

const ProfileCard = ({
  user,
  editable = false,
  onEdit,
  showStats = true,
  // stats = {} as ProfileCardStats,
  className = ''
}: {
  user: any;
  editable?: boolean;
  onEdit?: () => void;
  showStats?: boolean;
  stats?: ProfileCardStats;
  className?: string;
}) => {
  const [imageError, setImageError] = useState(false);

  if (!user) {
    return (
      <div className={`profile-card profile-card-empty ${className}`}>
        <div className="profile-card-content">
          <div className="profile-card-icon">👤</div>
          <p className="profile-card-empty-text">No user data available</p>
        </div>
      </div>
    );
  }

  // Extract user data with fallbacks
  const {
    username,
    email,
    name,
    login,
    avatar,
    avatar_url,
    avatarUrl,
    githubUsername,
    github_username,
    bio,
    role,
    points = 0,
    completedChallenges = 0,
    completed_challenges,
    joinedDate,
    joined_date,
    createdAt,
    created_at,
    html_url
  } = user;

  const displayName = name || login || username || 'Anonymous User';
  const displayUsername = username || login || github_username || githubUsername || '';
  const displayEmail = email || '';
  const displayBio = bio || '';
  const displayAvatar = avatar_url || avatarUrl || avatar || (displayUsername ? `https://github.com/${displayUsername}.png` : null);
  const displayRole = role || 'user';
  const displayPoints = points || stats.points || 0;
  const displayChallenges = completedChallenges || completed_challenges || stats.completedChallenges || 0;
  const displayJoinDate = joinedDate || joined_date || createdAt || created_at;
  const githubUrl = html_url || (displayUsername ? `https://github.com/${displayUsername}` : null);

  // Format join date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`profile-card ${className}`}>
      {/* Background Gradient */}
      <div className="profile-card-header">
        <div className="profile-card-gradient"></div>
        {editable && onEdit && (
          <button
            className="profile-card-edit-btn"
            onClick={onEdit}
            aria-label="Edit profile"
          >
            <BsPencilSquare />
          </button>
        )}
      </div>

      {/* Profile Picture */}
      <div className="profile-card-avatar-wrapper">
        <div className="profile-card-avatar">
          {displayAvatar && !imageError ? (
            <img
              src={displayAvatar}
              alt={`${displayName}'s avatar`}
              onError={handleImageError}
              className="profile-card-avatar-img"
            />
          ) : (
            <div className="profile-card-avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {displayRole === 'admin' && (
          <div className="profile-card-badge profile-card-badge-admin">
            <BsStar /> Admin
          </div>
        )}
      </div>

      {/* User Information */}
      <div className="profile-card-content">
        <h2 className="profile-card-name">{displayName}</h2>

        {displayUsername && (
          <p className="profile-card-username">@{displayUsername}</p>
        )}

        {displayEmail && (
          <p className="profile-card-email">{displayEmail}</p>
        )}

        {displayBio && (
          <p className="profile-card-bio">{displayBio}</p>
        )}

        {/* GitHub Link */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-card-github-link"
          >
            <BsGithub /> View GitHub Profile
          </a>
        )}

        {/* Join Date */}
        {displayJoinDate && (
          <div className="profile-card-join-date">
            <BsCalendar /> Joined {formatDate(displayJoinDate)}
          </div>
        )}

        {/* Statistics */}
        {showStats && (
          <div className="profile-card-stats">
            <div className="profile-card-stat">
              <div className="profile-card-stat-icon">
                <BsTrophy />
              </div>
              <div className="profile-card-stat-content">
                <div className="profile-card-stat-value">{displayPoints}</div>
                <div className="profile-card-stat-label">Points</div>
              </div>
            </div>
            <div className="profile-card-stat-divider"></div>
            <div className="profile-card-stat">
              <div className="profile-card-stat-icon">
                <BsStar />
              </div>
              <div className="profile-card-stat-content">
                <div className="profile-card-stat-value">{displayChallenges}</div>
                <div className="profile-card-stat-label">Challenges</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string,
    avatar: PropTypes.string,
    avatar_url: PropTypes.string,
    avatarUrl: PropTypes.string,
    githubUsername: PropTypes.string,
    github_username: PropTypes.string,
    bio: PropTypes.string,
    role: PropTypes.string,
    points: PropTypes.number,
    completedChallenges: PropTypes.number,
    completed_challenges: PropTypes.number,
    joinedDate: PropTypes.string,
    joined_date: PropTypes.string,
    createdAt: PropTypes.string,
    created_at: PropTypes.string,
    html_url: PropTypes.string,
  }),
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
  showStats: PropTypes.bool,
  stats: PropTypes.shape({
    points: PropTypes.number,
    completedChallenges: PropTypes.number,
  }),
  className: PropTypes.string,
};

export default ProfileCard;
