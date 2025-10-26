import { useState, useEffect } from 'react';
import { FaBullhorn, FaCalendarCheck, FaTimes } from 'react-icons/fa';

interface Notice {
  id: number;
  type: 'event' | 'notice';
  title: string;
  description: string;
  date?: string;
  link?: string;
}

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotices, setShowNotices] = useState(true);
  const fullText = 'Embedded Systems Design Club';
  const typingSpeed = 80; // milliseconds per character

  const importantNotices: Notice[] = [
    {
      id: 1,
      type: 'event',
      title: 'Annual Tech Fest 2024',
      description: 'Join us for our biggest event of the year!',
      date: 'Dec 15, 2024',
      link: '/events',
    },
    {
      id: 2,
      type: 'notice',
      title: 'Workshop Registration Open',
      description: 'Arduino and IoT workshop - Limited seats available',
      date: 'Dec 10, 2024',
      link: '/workshops',
    },
  ];

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector('.navbar') as HTMLElement | null;
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="hero">
      {showNotices && importantNotices.length > 0 && (
        <div className="hero-notices-left">
          <button
            className="notices-close"
            onClick={() => setShowNotices(false)}
            aria-label="Close notices"
          >
            <FaTimes />
          </button>
          <div className="notices-container">
            {importantNotices.map((notice) => (
              <div key={notice.id} className="notice-card">
                <div className="notice-icon">
                  {notice.type === 'event' ? <FaCalendarCheck /> : <FaBullhorn />}
                </div>
                <div className="notice-content">
                  <h4>{notice.title}</h4>
                  <p>{notice.description}</p>
                  {notice.date && <span className="notice-date">{notice.date}</span>}
                </div>
                {notice.link && (
                  <a href={notice.link} className="notice-link">
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            {displayedText}
            <span className="typewriter-cursor">|</span>
          </h1>
          <h2 className="hero-subtitle">Government College of Engineering Kannur</h2>
          <p className="hero-description">
            Empowering students to explore the fascinating world of embedded systems, IoT, and
            hardware design through hands-on learning and innovative projects.
          </p>
          <div className="hero-buttons">
            <a
              href="#about"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              Learn More
            </a>
            <a
              href="https://chat.whatsapp.com/BKA9R6hfyMM2VE23a8UzkW"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Join Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
