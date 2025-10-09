const About = () => {
  const aboutCards = [
    {
      icon: "🔧",
      title: "Hands-on Learning",
      description: "Learn by doing with real embedded systems projects, from basic microcontroller programming to advanced IoT applications."
    },
    {
      icon: "🚀",
      title: "Innovation Hub",
      description: "Foster creativity and innovation in embedded systems design, encouraging students to push the boundaries of technology."
    },
    {
      icon: "👥",
      title: "Community",
      description: "Build a strong community of embedded systems enthusiasts, sharing knowledge and collaborating on exciting projects."
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About ESDC</h2>
          <p>Bridging the gap between theory and practical implementation</p>
        </div>
        <div className="about-grid">
          {aboutCards.map((card, index) => (
            <div key={index} className="about-card">
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;