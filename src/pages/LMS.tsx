import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiUsers, FiStar, FiPlay, FiSearch } from 'react-icons/fi';
import { mockCourses } from '../data/mockCourses';

const LMS = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', ...Array.from(new Set(mockCourses.map((c) => c.category)))];

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <section style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header">
          <h2>Learning Management System</h2>
          <p>Master embedded systems with our comprehensive courses</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <FiSearch
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--subtext0)',
              }}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--surface0)',
                background: 'var(--surface0)',
                color: 'var(--text)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--subtext0)',
                }}
              >
                Level
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedLevel === level ? 'var(--blue)' : 'var(--surface0)',
                      color: selectedLevel === level ? 'var(--base)' : 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--subtext0)',
                }}
              >
                Category
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedCategory === cat ? 'var(--mauve)' : 'var(--surface0)',
                      color: selectedCategory === cat ? 'var(--base)' : 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="projects-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="project-card">
              <div className="project-image">
                <img
                  src={course.image}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'var(--blue)',
                    color: 'var(--base)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                  }}
                >
                  {course.level}
                </div>
              </div>
              <div className="project-content">
                <h3>{course.title}</h3>
                <p style={{ color: 'var(--subtext0)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {course.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--subtext0)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Instructor: <strong>{course.instructor}</strong>
                  </p>
                </div>

                <div
                  style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiClock color="var(--blue)" />
                    <span>{course.duration}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiBook color="var(--mauve)" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiUsers color="var(--green)" />
                    <span>{course.enrolled} enrolled</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiStar color="var(--yellow)" fill="var(--yellow)" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="project-tags" style={{ marginBottom: '1rem' }}>
                  <span className="tag">{course.category}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--surface0)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: course.isFree ? 'var(--green)' : 'var(--blue)',
                    }}
                  >
                    {course.isFree ? 'FREE' : `₹${course.price.toLocaleString()}`}
                  </div>
                  <Link
                    to={`/lms/${course.id}`}
                    className="btn btn-primary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    <FiPlay /> View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--subtext0)' }}>
            <FiBook size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No courses found matching your criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LMS;
