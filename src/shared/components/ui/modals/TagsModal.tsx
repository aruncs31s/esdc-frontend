import BaseModal from './BaseModal';
import { FaTag, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/ProjectModals.css';

interface Tag {
  id: string | number;
  name: string;
  projectCount?: number;
  color?: string;
}

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
}
const TagsModal = ({ isOpen, onClose, tags }: TagsModalProps) => {
  const navigate = useNavigate();

  const handleTagClick = (tagName: string) => {
    // Navigate to projects page with tag filter
    navigate(`/projects?tag=${encodeURIComponent(tagName)}`);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Project Tags (${tags.length})`}
      size="medium"
    >
      <div className="tags-modal-content">
        <div className="tags-modal-info">
          <FaSearch className="info-icon" />
          <p>Click on any tag to see all projects with that tag</p>
        </div>

        {tags && tags.length > 0 ? (
          <div className="tags-list-modal">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="tag-item-modal"
                onClick={() => handleTagClick(tag.name)}
                style={tag.color ? { borderColor: tag.color } : undefined}
              >
                <FaTag className="tag-icon" />
                <span className="tag-name">{tag.name}</span>
                {tag.projectCount !== undefined && (
                  <span className="tag-count">{tag.projectCount} projects</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaTag className="empty-icon" />
            <p>No tags added</p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default TagsModal;
