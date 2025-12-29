import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiBook,
  FiUsers,
  FiEye,
  FiThumbsUp,
  FiMessageSquare,
  FiPlayCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiDownload,
} from 'react-icons/fi';
import { mockCourses } from '../data/mockCourses';
import '../styles/courseDetail.css';

interface Module {
  id: number;
  title: string;
  duration: string;
  lessons: number;
}

interface Exam {
  id: number;
  title: string;
  duration: string;
  questions: number;
}

interface Test {
  id: number;
  title: string;
  duration: string;
  questions: number;
}

interface Comment {
  user: string;
  avatar: string;
  text: string;
  rating: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  image: string;
  price: number;
  isFree: boolean;
  lessons: number;
  category: string;
  views: number;
  likes: number;
  comments: number;
  modules: Module[];
  exams: Exam[];
  tests: Test[];
  commentsData: Comment[];
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    modules: true,
    exams: true,
    tests: true,
    comments: true,
  });

  const course = mockCourses.find((c) => c.id === Number(id)) as Course | undefined;

  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-container">
          <div
            style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}
          >
            <FiBook size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Course not found</p>
            <button
              onClick={() => navigate('/lms')}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'level-badge-beginner';
      case 'Intermediate':
        return 'level-badge-intermediate';
      case 'Advanced':
        return 'level-badge-advanced';
      default:
        return '';
    }
  };

  return (
    <div className="course-detail-page">
      {/* Background with gradient orbs */}
      <div className="course-background">
        <div className="course-gradient-orb course-orb-1"></div>
        <div className="course-gradient-orb course-orb-2"></div>
        <div className="course-gradient-orb course-orb-3"></div>
      </div>

      <div className="course-detail-container">
        {/* Back Button */}
        <button
          onClick={() => navigate('/lms')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--base)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--surface0)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <FiArrowLeft /> Back to Courses
        </button>

        {/* Header Section */}
        <div className="course-detail-header">
          <div className="course-header-image">
            <img src={course.image} alt={course.title} />
          </div>

          <div className="course-header-content">
            <h1 className="course-title">{course.title}</h1>

            <div className="course-instructor">
              <FiUsers size={18} />
              <span>
                Taught by <strong>{course.instructor}</strong>
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {course.description}
            </p>

            <div className="course-meta-info">
              <div className="course-meta-item">
                <div className="course-meta-label">Duration</div>
                <div className="course-meta-value">{course.duration}</div>
              </div>
              <div className="course-meta-item">
                <div className="course-meta-label">Lessons</div>
                <div className="course-meta-value">{course.lessons}</div>
              </div>
              <div className="course-meta-item">
                <div className="course-meta-label">Enrolled</div>
                <div className="course-meta-value">{course.enrolled.toLocaleString()}</div>
              </div>
              <div className="course-meta-item">
                <div className="course-meta-label">Rating</div>
                <div className="course-meta-value" style={{ color: '#fbbf24' }}>
                  ★ {course.rating}
                </div>
              </div>
            </div>

            <div className="course-pricing-section">
              <div className="course-price">
                <div className="course-price-label">Price</div>
                <div className={`course-price-amount ${course.isFree ? 'course-price-free' : ''}`}>
                  {course.isFree ? 'FREE' : `₹${course.price.toLocaleString()}`}
                </div>
              </div>

              <button className="course-enroll-btn">
                <FiPlayCircle /> Enroll Now
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="course-content-grid">
          {/* Main Content */}
          <div className="course-main-content">
            {/* Modules Section */}
            <div
              className={`course-section ${expandedSections.modules ? 'expanded' : ''}`}
              onClick={() => toggleSection('modules')}
            >
              <div className="course-section-header">
                <FiBook className="course-section-icon" />
                <h2 className="course-section-title">Modules ({course.modules.length})</h2>
                <span className="course-section-toggle">▼</span>
              </div>
              <div className="course-section-content">
                <ul className="course-list">
                  {course.modules.map((module, index) => (
                    <li key={module.id} className="course-list-item">
                      <div className="course-list-item-icon">
                        <FiCheckCircle />
                      </div>
                      <div className="course-list-item-content">
                        <div className="course-list-item-title">
                          Module {index + 1}: {module.title}
                        </div>
                        <div className="course-list-item-meta">
                          {module.lessons} lessons • {module.duration}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exams Section */}
            <div
              className={`course-section ${expandedSections.exams ? 'expanded' : ''}`}
              onClick={() => toggleSection('exams')}
            >
              <div className="course-section-header">
                <FiAward className="course-section-icon" />
                <h2 className="course-section-title">Exams ({course.exams.length})</h2>
                <span className="course-section-toggle">▼</span>
              </div>
              <div className="course-section-content">
                <ul className="course-list">
                  {course.exams.map((exam, index) => (
                    <li key={exam.id} className="course-list-item">
                      <div className="course-list-item-icon">
                        <FiTrendingUp />
                      </div>
                      <div className="course-list-item-content">
                        <div className="course-list-item-title">
                          Exam {index + 1}: {exam.title}
                        </div>
                        <div className="course-list-item-meta">
                          {exam.questions} questions • {exam.duration}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tests Section */}
            <div
              className={`course-section ${expandedSections.tests ? 'expanded' : ''}`}
              onClick={() => toggleSection('tests')}
            >
              <div className="course-section-header">
                <FiCheckCircle className="course-section-icon" />
                <h2 className="course-section-title">Tests ({course.tests.length})</h2>
                <span className="course-section-toggle">▼</span>
              </div>
              <div className="course-section-content">
                <ul className="course-list">
                  {course.tests.map((test, index) => (
                    <li key={test.id} className="course-list-item">
                      <div className="course-list-item-icon">
                        <FiPlayCircle />
                      </div>
                      <div className="course-list-item-content">
                        <div className="course-list-item-title">
                          Test {index + 1}: {test.title}
                        </div>
                        <div className="course-list-item-meta">
                          {test.questions} questions • {test.duration}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comments Section */}
            <div
              className={`course-section ${expandedSections.comments ? 'expanded' : ''}`}
              onClick={() => toggleSection('comments')}
            >
              <div className="course-section-header">
                <FiMessageSquare className="course-section-icon" />
                <h2 className="course-section-title">
                  Learner Reviews ({course.commentsData.length})
                </h2>
                <span className="course-section-toggle">▼</span>
              </div>
              <div className="course-section-content">
                <div className="course-comments-container">
                  {course.commentsData.map((comment, index) => (
                    <div key={index} className="course-comment">
                      <div className="course-comment-header">
                        <div className="course-comment-avatar">{comment.avatar}</div>
                        <div>
                          <div className="course-comment-user">{comment.user}</div>
                          <div className="course-comment-rating">
                            {Array(comment.rating)
                              .fill(0)
                              .map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                          </div>
                        </div>
                      </div>
                      <p className="course-comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="course-sidebar">
            {/* Course Info Card */}
            <div className="course-sidebar-card">
              <h3 className="course-sidebar-title">Course Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={`course-level-badge ${getLevelBadgeClass(course.level)}`}>
                  {course.level}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FiEye size={18} />
                  <span>{course.views.toLocaleString()} views</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FiThumbsUp size={18} />
                  <span>{course.likes.toLocaleString()} likes</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FiMessageSquare size={18} />
                  <span>{course.comments} comments</span>
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className="course-sidebar-card">
              <h3 className="course-sidebar-title">Category</h3>
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, var(--blue) 0%, var(--lavender) 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {course.category}
              </div>
            </div>

            {/* What You'll Learn Card */}
            <div className="course-sidebar-card">
              <h3 className="course-sidebar-title">You'll Learn</h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <FiCheckCircle
                    size={18}
                    style={{ color: 'var(--green)', marginTop: '0.1rem', flexShrink: 0 }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Master {course.category}</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <FiCheckCircle
                    size={18}
                    style={{ color: 'var(--green)', marginTop: '0.1rem', flexShrink: 0 }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Build real projects</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <FiCheckCircle
                    size={18}
                    style={{ color: 'var(--green)', marginTop: '0.1rem', flexShrink: 0 }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Industry-level skills</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <FiCheckCircle
                    size={18}
                    style={{ color: 'var(--green)', marginTop: '0.1rem', flexShrink: 0 }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Certification included</span>
                </li>
              </ul>
            </div>

            {/* Download Resources Card */}
            <div className="course-sidebar-card">
              <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FiDownload /> Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
