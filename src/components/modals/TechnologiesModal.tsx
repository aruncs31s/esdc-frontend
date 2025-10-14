import BaseModal from './BaseModal';
import { FaCode, FaBook, FaGraduationCap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProjectModals.css';

interface Technology {
  id: string | number;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  courseLink?: string;
}

interface TechnologiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  technologies: Technology[];
}

const TechnologiesModal = ({ isOpen, onClose, technologies }: TechnologiesModalProps) => {
  const navigate = useNavigate();

  const handleCourseClick = (tech: Technology) => {
    if (tech.courseLink) {
      navigate(tech.courseLink);
    } else {
      // Default to courses page with search query
      navigate(`/courses?search=${encodeURIComponent(tech.name)}`);
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Technologies Used (${technologies.length})`}
      size="large"
    >
      <div className="technologies-modal-content">
        {technologies && technologies.length > 0 ? (
          <div className="technologies-grid-modal">
            {technologies.map((tech) => (
              <div key={tech.id} className="technology-card-modal">
                <div className="tech-header">
                  {tech.icon ? (
                    <img src={tech.icon} alt={tech.name} className="tech-icon" />
                  ) : (
                    <FaCode className="tech-icon-default" />
                  )}
                  <h3>{tech.name}</h3>
                  {tech.category && <span className="tech-category">{tech.category}</span>}
                </div>

                {tech.description && <p className="tech-description">{tech.description}</p>}

                <div className="tech-actions">
                  <button
                    className="tech-btn tech-btn-primary"
                    onClick={() => handleCourseClick(tech)}
                  >
                    <FaGraduationCap /> Learn {tech.name}
                  </button>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(tech.name + ' documentation')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tech-btn tech-btn-secondary"
                  >
                    <FaBook /> Docs
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaCode className="empty-icon" />
            <p>No technologies listed</p>
          </div>
        )}

        <div className="modal-footer">
          <button
            className="btn-view-all-courses"
            onClick={() => {
              navigate('/courses');
              onClose();
            }}
          >
            <FaGraduationCap /> View All Courses
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default TechnologiesModal;
