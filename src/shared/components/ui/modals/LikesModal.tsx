import BaseModal from './BaseModal';
import { FaHeart, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';
import '../../../../styles/ProjectModals.css';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  likedAt?: string;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: User[];
  totalLikes: number;
}

const LikesModal = ({ isOpen, onClose, likes, totalLikes }: LikesModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${totalLikes} ${totalLikes === 1 ? 'Like' : 'Likes'}`}
      size="medium"
    >
      <div className="likes-modal-content">
        {likes && likes.length > 0 ? (
          <div className="users-list">
            {likes.map((user) => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FaUser />}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  {user.email && (
                    <p className="user-email">
                      <FaEnvelope /> {user.email}
                    </p>
                  )}
                  {user.likedAt && (
                    <p className="user-date">
                      <FaCalendar /> Liked on {new Date(user.likedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <FaHeart className="like-icon" />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaHeart className="empty-icon" />
            <p>No likes yet</p>
            <span>Be the first to like this project!</span>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default LikesModal;
