const Footer = () => {
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
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ESDC</h3>
            <p>
              Embedded Systems Design Club
              <br />
              Government College of Engineering Kannur
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('projects');
                  }}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('team');
                  }}
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">Tutorials</a>
              </li>
              <li>
                <a
                  href="https://github.com/Embedded-Systems-GCEK"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/orgs/Embedded-Systems-GCEK/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community Discussions
                </a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Embedded Systems Design Club, GCEK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
