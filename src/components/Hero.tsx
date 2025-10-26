import { useState, useEffect } from 'react';

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'Embedded Systems Design Club';
  const typingSpeed = 80; // milliseconds per character

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
