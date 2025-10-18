import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiBook,
  FiClock,
  FiUsers,
  FiStar,
  FiPlay,
  FiHeart,
  FiMessageCircle,
  FiCheckCircle,
  FiArrowLeft,
} from 'react-icons/fi';
import { mockCourses } from '../data/mockCourses';
import { mockCourseDetails } from '../data/mockCourseDetails';

const CourseDetail = () => {
  const { id } = useParams();
  const courseId = parseInt(id || '1');
  const course = mockCourses.find((c) => c.id === courseId);
  const details =
    mockCourseDetails[courseId as keyof typeof mockCourseDetails] || mockCourseDetails[1];

  const [activeTab, setActiveTab] = useState<'syllabus' | 'reviews' | 'students' | 'projects'>(
    'syllabus'
  );
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(details.likes);

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <Link to="/lms" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const avgRating = details.reviews.reduce((sum, r) => sum + r.rating, 0) / details.reviews.length;

  return (
    <section style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <Link
          to="/lms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            color: 'var(--blue)',
            textDecoration: 'none',
          }}
        >
          <FiArrowLeft /> Back to Courses
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <img
              src={course.image}
              alt={course.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '1.5rem',
              }}
            />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--subtext0)', marginBottom: '1.5rem' }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiStar color="var(--yellow)" fill="var(--yellow)" size={20} />
                <span style={{ fontWeight: '600' }}>{avgRating.toFixed(1)}</span>
                <span style={{ color: 'var(--subtext0)' }}>({details.reviews.length} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUsers color="var(--green)" size={20} />
                <span>{details.enrolledStudents.length} students enrolled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiClock color="var(--blue)" size={20} />
                <span>{course.duration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBook color="var(--mauve)" size={20} />
                <span>{course.lessons} lessons</span>
              </div>
            </div>

            <div
              style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}
            >
              <button
                onClick={handleLike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: liked ? 'var(--red)' : 'var(--surface0)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--text)',
                }}
              >
                <FiHeart fill={liked ? 'currentColor' : 'none'} />
                <span>{likeCount} Likes</span>
              </button>
              <div
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--surface0)',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontWeight: '600' }}>Instructor:</span> {course.instructor}
              </div>
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}
          >
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--blue)',
                marginBottom: '1rem',
              }}
            >
              ${course.price}
            </div>
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <FiPlay /> Enroll Now
            </button>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--subtext0)',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              30-day money-back guarantee
            </div>

            <div style={{ borderTop: '1px solid var(--surface0)', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>This course includes:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <FiCheckCircle color="var(--green)" /> {course.lessons} video lessons
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <FiCheckCircle color="var(--green)" /> Lifetime access
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <FiCheckCircle color="var(--green)" /> Certificate of completion
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <FiCheckCircle color="var(--green)" /> Project files
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--surface0)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(['syllabus', 'reviews', 'students', 'projects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '1rem 2rem',
                  background: activeTab === tab ? 'var(--blue)' : 'transparent',
                  color: activeTab === tab ? 'var(--base)' : 'var(--text)',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'syllabus' && (
          <div>
            {details.syllabus.map((week, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{ padding: '1.5rem', marginBottom: '1rem' }}
              >
                <h3 style={{ marginBottom: '1rem' }}>
                  Week {week.week}: {week.title}
                </h3>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {week.topics.map((topic, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--subtext0)' }}>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3>Average Rating: {avgRating.toFixed(1)} / 5.0</h3>
              <p style={{ color: 'var(--subtext0)' }}>Based on {details.reviews.length} reviews</p>
            </div>
            {details.reviews.map((review) => (
              <div
                key={review.id}
                className="glass-card"
                style={{ padding: '1.5rem', marginBottom: '1rem' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
                >
                  <div>
                    <h4>{review.user}</h4>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          color="var(--yellow)"
                          fill={i < review.rating ? 'var(--yellow)' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <span style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                    {review.date}
                  </span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>
              Enrolled Students ({details.enrolledStudents.length})
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem',
              }}
            >
              {details.enrolledStudents.map((student) => (
                <div key={student.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{student.name}</h4>
                      <span style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                        Progress: {student.progress}%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'var(--surface0)',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--green)',
                        height: '100%',
                        width: `${student.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Related Projects</h3>
            {details.relatedProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>{project.title}</h4>
                  <p style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>
                    by {project.author}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiHeart color="var(--red)" />
                  <span>{project.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <h3
            style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiMessageCircle /> Comments ({details.comments.length})
          </h3>
          {details.comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-card"
              style={{ padding: '1.5rem', marginBottom: '1rem' }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
              >
                <h4>{comment.user}</h4>
                <span style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>{comment.date}</span>
              </div>
              <p style={{ marginBottom: '0.5rem' }}>{comment.text}</p>
              <span style={{ color: 'var(--blue)', fontSize: '0.9rem', cursor: 'pointer' }}>
                {comment.replies} replies
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;
