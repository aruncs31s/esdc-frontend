const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>Join our community and start your embedded systems journey</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>Government College of Engineering Kannur<br />Kannur, Kerala, India</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>esdc@gcek.ac.in</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <div>
                <h3>Connect</h3>
                <p>Follow us on social media for updates and announcements</p>
              </div>
            </div>
          </div>
          <div className="contact-form-container">
            <div className="contact-whatsapp">
              <h3>Join Our Community</h3>
              <p>Connect with fellow embedded systems enthusiasts, ask questions, and stay updated with our latest projects and events.</p>
              <a 
                href="https://chat.whatsapp.com/BKA9R6hfyMM2VE23a8UzkW" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary whatsapp-btn"
              >
                <img src="/icons/whatsapp.png" alt="WhatsApp" className="whatsapp-icon" />
                Join WhatsApp Group
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;